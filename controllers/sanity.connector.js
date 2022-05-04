/**
 * Sanity connector to retrieve collectibles' addresses needed to sign up the event
 * Author: Chean Koh
 * Version: 1.0.0
 * Updated: 04/05/2022
 */
const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: 'kyk4jks2',
    dataset: 'production',
    apiVersion: (new Date()).toISOString().split('T')[0],
    useCdn: false, // `false` if you want to ensure fresh data
})
const sanity = {}

/**
 * @param {String} eventID 
 * @author Chean Koh
 * @returns
 * {
 *  "contracts" : String[],
 *  "signUpPeriod" : Datetime
 * }
 */
sanity.getContracts = async (eventID) => {
    const query = `*[_type == "event" && eventID.current == "${eventID}"] {contracts,signUpPeriod}`
    try {
        const data = await client.fetch(query);
        return data[0]
    } catch (error) {
        console.log(error);
    }
}

module.exports = sanity;