const mysql = require("mysql");
const config = require("config");

// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
//52.41.75.101
const dbConfig = config.get("dbConfig");
const con = mysql.createPool(dbConfig);

const DB = {
  query(sql, values) {
    return new Promise((resolve, reject) => {
      const queryObj = con.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
};

module.exports = DB;
