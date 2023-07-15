const express = require('express');
const dbConnection = require('../database/dbConnection');
const router = express.Router();

router.use('/registration', express.static("./client/registration-page"));

router.post('/users/register', (req, res) => {
   const { username, emailAddress, password } = req.body;

   if (!req.body) {
      res.status(400).send({ message: "Fields are required" });
      return;
   }

   // Hash and salt the password for encryption
   const encryptedPassword = password;

   const insertQuery = `INSERT INTO USER (
      username, email, password
   ) VALUES (
      '${username}', '${emailAddress}', '${encryptedPassword}'
   )`;

   dbConnection.query(insertQuery, (err) => {
      if (err) {
         // Check if error refers to duplicate usernames
         // Check if error refers to duplicate email addresses
         // Send 400 message to user saying the error
      }

      console.log(`Added User: ${username}`);
      // Redirect user to login page
   })
});

module.exports = router;