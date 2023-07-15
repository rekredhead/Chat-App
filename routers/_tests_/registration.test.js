const request = require('supertest');
const express = require('express');
const router = require('../registration');
const dbConnection = require('../../database/dbConnection');
const { PORT } = require('../../config');
require('../../database/createDB');

const app = express();
app.use(express.json());
app.use('/', router);

describe('User Registration API', () => {
   let server;

   beforeAll(() => {
      server = app.listen(PORT);
   });
   afterAll(async () => {
      await new Promise((resolve) => server.close(resolve));
      await cleanUpTestDataFromDatabase();
   });

   it('should register a new user successfully', async () => {
      const response = await request(app)
         .post('/users/register')
         .send({
            username: 'testuser',
            emailAddress: 'test@example.com',
            password: 'testpassword'
         });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Registered user: testuser');
   });

   it('should handle duplicate username', async () => {
      const response = await request(app)
         .post('/users/register')
         .send({
            username: 'testuser',
            emailAddress: 'newuser@example.com',
            password: 'newpassword'
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('This username is already taken');
   });

   it('should handle duplicate email address', async () => {
      const response = await request(app)
         .post('/users/register')
         .send({
            username: 'newuser',
            emailAddress: 'test@example.com',
            password: 'newpassword'
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('This email address is already being used');
   });

   const cleanUpTestDataFromDatabase = async () => {
      const deleteTestDataQuery = `DELETE FROM USER WHERE username='testuser' OR username='newuser' OR email='test@example.com' OR email='newuser@example.com'`;
      await dbConnection.query(deleteTestDataQuery, (err) => {
         if (err) throw err;
      });
   };
});