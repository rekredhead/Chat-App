require('../../database/createDB');

const request = require('supertest');
const express = require('express');
const router = require('../passwordReset');
const dbConnection = require('../../database/dbConnection');
const encryptPassword = require('../functions/encryptPassword');
const { cachePasswordResettingData, getPasswordResettingDataFromCache, deleteDataFromCache } = require('../functions/handleRedisCaching');
const { PORT } = require('../../config');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Password Reset API', () => {
   let server;

   beforeAll(async () => {
      server = app.listen(PORT);
   });
   afterAll(async () => {
      await new Promise((resolve) => server.close(resolve));
      await cleanUpTestDataFromDatabase();
   });

   it('should send verification code to user email successfully', async () => {
      // Create a test user
      await createUserInDatabase();

      const response = await request(app)
         .post('/users/password-reset/new-password')
         .send({
            username: 'testuser',
            newPassword: 'testpassword2'
         });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Verification Code was sent to test@example.com. Code will expire in 300 seconds');
   });

   it('should notify if a username is not found - new-password API', async() => {
      const response = await request(app)
         .post('/users/password-reset/new-password')
         .send({
            username: 'testuser123',
            newPassword: 'testpassword'
         });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username not found');
   });

   it('should successfully cache the username, newPassword and verificationCode', async() => {
      await request(app)
         .post('/users/password-reset/new-password')
         .send({
            username: 'testuser',
            newPassword: 'mynewpassword'
         });

      const cachedData = await getPasswordResettingDataFromCache('testuser');
      const isUsernameInCachedData = Object.entries(cachedData).length > 0;
      
      expect(isUsernameInCachedData).toBe(true);
      expect(cachedData.password).toBe('mynewpassword');
      expect(!cachedData.verificationCode).toBe(false); // meaning, the verification code should be stored as well
   });

   it('should notify if a username is not found - verification API', async() => {
      const response = await request(app)
         .post('/users/password-reset/verification')
         .send({
            username: 'testuser123',
            newPassword: 'testpassword'
         });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username not found');
   });
   
   it('should notify if a verification code has expired', async() => {
      await cachePasswordResettingData('testuser', 'testpassword', 'testverificationcode');
      await deleteDataFromCache('testuser');

      const response = await request(app)
         .post('/users/password-reset/verification')
         .send({
            username: 'testuser',
            verificationCode: 'testverificationcode'
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('This verification code has expired. Please try again');
   });

   it('should notify if a verification code is incorrect', async() => {
      await cachePasswordResettingData('testuser', 'testpassword', 'testverificationcode');

      const response = await request(app)
         .post('/users/password-reset/verification')
         .send({
            username: 'testuser',
            verificationCode: 'randomcode'
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Incorrect verification code');
   });

   it('should update the password of the user successfully', async() => {
      await cachePasswordResettingData('testuser', 'testpassword', 'testverificationcode');

      const response = await request(app)
         .post('/users/password-reset/verification')
         .send({
            username: 'testuser',
            verificationCode: 'testverificationcode'
         });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password changed successfully');
   });
});

const createUserInDatabase = async () => {
   const username = 'testuser';
   const useremail = 'test@example.com';
   const userpassword = await encryptPassword('testpassword');

   const insertUserQuery = `INSERT INTO USER (username, email, password) VALUES ('${username}', '${useremail}', '${userpassword}')`;
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