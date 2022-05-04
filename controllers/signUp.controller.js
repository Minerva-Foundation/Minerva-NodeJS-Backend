const UserEvent = require("../models/UserEvent.js");
const MinervaEvent = require("../models/MinervaEvent.js");
const terraObj = require("./terra.connector.js");
const sanity = require("./sanity.connector.js");
const { Http2ServerResponse, Http2ServerRequest } = require("http2");

/**
 * @param {Http2ServerRequest} req 
 * {
 *  eventID: String
 *  userWallet: String
 *  params: String[]
 * }
 * @param {Http2ServerResponse} res 
 * {
 *  message: `userWallet` has signed up for `eventID`
 * }
 * @author Chean Koh
 */
exports.signUpEvent = async (req, res) => {
    var timeReceivedRequest = new Date();
    try {
        // Retrieving needed details from Sanity
        var contractsDetails = await sanity.getContracts(req.body.eventID);

        // Checking if the event has expired
        var expiryTime = new Date(contractsDetails.signUpPeriod);
        var isExpired = checkExpiry(timeReceivedRequest, expiryTime);
        if (!isExpired) res.status(500).json({ message: "Invalid signup! The event has expired." });

        // Querying blockchain
        let validSignUp = await signUpLogic(contractsDetails.contracts, req.body.userWallet, res);
        // If user does not hold any asset needed for the event
        if (!validSignUp) res.status(500).json({ message: "Invalid signup! User doesn't hold the assets needed for the event." });

        const [events, _] = await MinervaEvent.findByName(req.body.eventID);
        // retrieve eventId to store userEvent's data
        var event_id;

        // The event was already been signed up by some user
        // simply get the id from events
        if (events.length > 0) {
            event_id = events[0].id;
        }
        // The event hasn't been registered yet
        // Store event and retrieve its id
        else {
            let minervaEvent = new MinervaEvent(req.body.eventID, expiryTime.toISOString());
            minervaEvent = await minervaEvent.save();
            event_id = minervaEvent[0].insertId;
        }

        // Valid signup, store user params into table UserEvent
        let userEvent = new UserEvent(event_id, req.body.userWallet, req.body.params);
        userEvent = await userEvent.save();
        res.status(201).json({ message: req.body.userWallet + " has signed up for " + req.body.eventID });
    } catch (error) {
        res.status(500).json({
            location: "Signing up user for event signUp()",
            message: error
        });
    }
};

// Check if event is expired
const checkExpiry = (requestTime, expiryTime, res) => {
    return requestTime.getTime() <= expiryTime.getTime();
}

// Separate logic of sign up (querying blockchain)
const signUpLogic = async (contractArr, owner, res) => {
    var validSignUp = false;
    for (const contract of contractArr) {
        try {
            var result = await terraObj.isOwner(contract, owner);
            if (result.tokens.length > 0) validSignUp = true;
        } catch (error) {
            console.log(error);
        }
    }

    return validSignUp;
}

/**
 * @param {Http2ServerRequest} req
 * {
 *  eventID: String,
 *  userWallet: String
 * } 
 * @param {Http2ServerResponse} res 
 * @author Chean Koh
 */
exports.signUpStatus = async (req, res) => {
    try {
        // Retrieve event_id from db
        const [events, _] = await MinervaEvent.findByName(req.body.eventID);
        if (events.length > 0) {
            var event_id = events[0].id;

            // Query db to check if user has already signed up
            const [users, __] = await UserEvent.findEventByWallet(event_id, req.body.userWallet);

            if (users.length > 0)
                res.status(200).json({ isSignUp: true }).end();
            else
                res.status(200).json({ isSignUp: false }).end();
        } else
            res.status(500).json({
                message: "Event does not exist"
            }).end();
    } catch (error) {
        console.log(error);
    }
};
