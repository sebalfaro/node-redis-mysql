const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "database",
  port: 3306,
  user: "root",
  password: "admin",
  database: "companydb",
});

module.exports = pool;
