const { createConnection } = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('../config');
const { userTableQuery, profileTableQuery, messagesTableQuery, dbTables } = require('./createDB');

describe('createDB.js', () => {
   let connection;

   beforeAll(() => {
      connection = createConnection({
         host: DB_HOST,
         user: DB_USER,
         password: DB_PASSWORD,
         port: DB_PORT
      });
   });
   afterAll(async () => {
      await new Promise((resolve) => connection.end(resolve));
   });

   it('should connect to MySQL server successfully', (done) => {
      connection.connect((err) => {
         expect(err).toBeFalsy();
         done();
      });
   });

   it('should create the database without errors', (done) => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
         expect(err).toBeFalsy();
         done();
      });
   });

   it('should set the database to use for the MySQL connection without errors', (done) => {
      connection.changeUser({ database: DB_NAME }, (err) => {
         expect(err).toBeFalsy();
         done();
      });
   });

   it('should create all the tables without errors', (done) => {
      const createTable = (table) =>
         new Promise((resolve, reject) => {
            connection.query(table, (err) => {
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