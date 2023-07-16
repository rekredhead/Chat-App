require('../../database/createDB');

const request = require('supertest');
const express = require('express');
const router = require('../login');
const dbConnection = require('../../database/dbConnection');
const encryptPassword = require('../functions/encryptPassword');
const { PORT } = require('../../config');

const app = express();
app.use(express.json());
app.use('/', router);

describe('User Login API', () => {
   let server;

   beforeAll(async () => {
      server = app.listen(PORT);
   });
   afterAll(async () => {
      await new Promise((resolve) => server.close(resolve));
      await cleanUpTestDataFromDatabase();
   });

   it('should verify a user login successfully', async () => {
      try {
         // Create a test user
         await createUserInDatabase();

         const response = await request(app)
            .post('/users/login')
            .send({
               username: 'testuser',
               password: 'testpassword'
            });

         expect(response.status).toBe(200);
         expect(response.body.message).toBe('User is verified');
      } catch (err) {
         console.log('hi');
      }
   });

   it('should notify if a username is not found', async () => {
      const response = await request(app)
         .post('/users/login')
         .send({
            username: 'testuser123',
            password: 'testpassword'
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username not found');
   });

   it('should notify if the password is incorrect', async () => {
      const response = await request(app)
         .post('/users/login')
         .send({
            username: 'testuser',
            password: 'testpassword123'
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Incorrect Password');
   });

   const createUserInDatabase = async () => {
      const username = 'testuser';
      const password = await encryptPassword('testpassword');

      const insertUserQuery = `INSERT INTO USER (username, password) VALUES ('${username}', '${password}')`;
      await dbConnection.query(insertUserQuery, (err) => {
         if (err) throw err;
      });
   }

   const cleanUpTestDataFromDatabase = async () => {
      const deleteTestDataQuery = `DELETE FROM USER WHERE username='testuser'`;
      await dbConnection.query(deleteTestDataQuery, (err) => {
         if (err) throw err;
      });
   }
});