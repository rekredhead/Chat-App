const { createConnection } = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('../config');
const dbTables = require('./createDB');

describe('createDB.js', () => {
   let testConnection;

   // Run this before testing anything else
   beforeAll(() => {
      testConnection = createConnection({
         host: DB_HOST,
         user: DB_USER,
         password: DB_PASSWORD,
         port: DB_PORT
      });
   });

   // Run this after testing everything else
   afterAll(async () => {
      await new Promise((resolve) => testConnection.end(resolve));
   });

   it('should connect to MySQL server successfully', (done) => {
      testConnection.connect((err) => {
         expect(err).toBeFalsy();
         done();
      });
   });

   it('should create the database without errors', (done) => {
      testConnection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
         expect(err).toBeFalsy();
         done();
      });
   });

   it('should set the database to use for the MySQL connection without errors', (done) => {
      testConnection.changeUser({ database: DB_NAME }, (err) => {
         expect(err).toBeFalsy();
         done();
      });
   });

   it('table creation queries should be valid', (done) => {
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
      const testingTableQueries = [userTableQuery, profileTableQuery, messagesTableQuery];

      dbTables.forEach((tableQuery, index) => {
         const simplifyString = (value) => value.toLowerCase().replace(/\s/g, '');

         expect( simplifyString(tableQuery) ).toBe( simplifyString(testingTableQueries[index]) );
      });

      done();
   });

   it('should create all the tables without errors', (done) => {
      const createTable = (table) =>
         new Promise((resolve, reject) => {
            testConnection.query(table, (err) => {
               if (err) reject(err);
               else resolve();
            });
         });

      Promise.all(dbTables.map(createTable))
         .then(() => {
            done();
         })
         .catch((err) => {
            expect(err).toBeFalsy();
            done();
         });
   });
});