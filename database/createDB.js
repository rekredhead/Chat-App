const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = require('../config');
const { createConnection } = require('mysql');

const createTableIfNotExistQuery = 'CREATE TABLE IF NOT EXISTS';
const userTableQuery = `${createTableIfNotExistQuery} USER(
   userID INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(50) UNIQUE,
   email VARCHAR(100) UNIQUE,
   password VARCHAR(60),
   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
const profileTableQuery = `${createTableIfNotExistQuery} PROFILE(
   profileID INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(50) REFERENCES USER(username),
   bio VARCHAR(200),
   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
const messagesTableQuery = `${createTableIfNotExistQuery} MESSAGES(
   messageID INT AUTO_INCREMENT PRIMARY KEY,
   userID INT REFERENCES USER(userID),
   content VARCHAR(2000),
   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
const dbTables = [ userTableQuery, profileTableQuery, messagesTableQuery ];

// Establish a connection to local MySQL server 
const connection = createConnection({
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   port: DB_PORT
});

connection.connect((err) => {
   if (err) {
      const mysqlNotConnectedErrRegexp = /(connect)*(econnrefused)\b/i;

      // Show a mysqlNotConnected error if it appears, else throw the different error message
      if (mysqlNotConnectedErrRegexp.test(err.message)) {
         console.log("MySQL not Connected");
         return;
      }

      throw err;
   }

   connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
      if (err) throw err;
   });

   // Set the database to use for the MySQL connection
   connection.changeUser({ database: DB_NAME }, (err) => {
      if (err) throw err;
   });

   // Create all the tables for the database
   dbTables.map((table) => {
      connection.query(table, (err) => {
         if (err) throw err;
      });
   });

   // Close the connection after everything is done
   connection.end((err) => {
      if (err) throw err;
   });
});

module.exports = dbTables;