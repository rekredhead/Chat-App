/**
 * POST /users/login => Login users to the app
 * Request body: username, password
 * 
 * This file contains one API that checks if the user's entered login details match with the one in the database.
 * A search query is done to check if the username is in the database. If not, it will send the respective error message to the client.
 * Then it checks if the password matches with the encrypted password in the database. If not, it will send the respective error message to the client.
 * Then it creates a session for the user containing their username and then sends an OK response to the client.
 */

const express = require('express');
const bcrypt = require('bcrypt');
const dbConnection = require('../database/dbConnection');
const router = express.Router();

router.post('/users/login', (req, res) => {
   const { username, password } = req.body;

   const getMatchingDataQuery = `SELECT password FROM USER WHERE username='${username}'`;
   dbConnection.query(getMatchingDataQuery, async (err, result) => {
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }
      const isUserInDatabase = result.length === 1;

      if (!isUserInDatabase) {
         res.status(400).send({ message: "Username not found" });
         return;
      }
      
      const userPasswordInDB = result[0].password;
      const doesPasswordMatch = await bcrypt.compare(password, userPasswordInDB);

      if (!doesPasswordMatch) {
         res.status(400).send({ message: "Incorrect Password" });
         return;
      }

      req.session.username = username;
      res.status(200).send({ message: "User is verified" });
   });
});

module.exports = router;