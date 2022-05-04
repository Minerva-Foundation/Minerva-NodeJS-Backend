const db = require("../config/db");

/**
 * Database Entity which stores the details of user's signup
 * Author: Chean Koh
 * Version: 1.0.0
 * Updated: 04/05/2022
 */
class UserEvent {
    constructor(eventId, userWallet, params) {
        this.eventId = eventId;
        this.userWallet = userWallet;
        this.tableName = 'user_events';
        // Ulgy method to store params
        // TODO: Frontend to include name of params

        for (let i = 0; i = 10 - params.length; i++) {
            params.push('undefined');
        }
        let processedParam = []
        params.forEach((param) => {
            processedParam.push("'" + param + "'");
        })
        this.params = processedParam.join(",");

    }

    static tableName = 'user_events';

    save() {
        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDate();

        let createdAtDate = `${yyyy}-${mm}-${dd}`;

        let sql = `INSERT INTO ${this.tableName}(
            event_id,
            user_wallet,
            sign_up_time,
            param1,
            param2,
            param3,
            param4,
            param5,
            param6,
            param7,
            param8,
            param9,
            param10
        )
        VALUES('${this.eventId}','${this.userWallet}','${createdAtDate}',${this.params});`;

        return db.execute(sql);
    }

    static findAll() {
        let sql = `SELECT * FROM ${this.tableName};`;

        return db.execute(sql);
    }

    static findEventByWallet(eventID, wallet) {
        let sql = `SELECT * FROM ${this.tableName} WHERE event_id = '${eventID}' and user_wallet = '${wallet}';`;

        return db.execute(sql);
    }
}

module.exports = UserEvent;
