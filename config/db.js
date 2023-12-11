const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "admin",
  database: "sqldb",
});

// Exporting the promise for the pool
module.exports = pool.promise();
