const db = require("../config/db");

/**
 * Database Entity which stores the Minerva Events
 * Author: Chean Koh
 * Version: 1.0.0
 * Updated: 04/05/2022
 */
class MinervaEvent {
  constructor(name, signUpPeriod) {
    this.name = name;
    this.signUpPeriod = signUpPeriod.split('T')[0];
    this.tableName = 'minerva_events';
  }

  static tableName = 'minerva_events';

  save() {
    let sql = `
    INSERT INTO ${this.tableName}(
      name,
      expiry_date
    )
    VALUES(
      '${this.name}',
      '${this.signUpPeriod}'
    )
    `;

    return db.execute(sql);
  }

  static findAll() {
    let sql = `SELECT * FROM ${this.tableName};`;

    return db.execute(sql);
  }

  static findByName(name) {
    let sql = `SELECT id, expiry_date FROM ${this.tableName} WHERE name = '${name}';`;

    return db.execute(sql);
  }
}

module.exports = MinervaEvent;
