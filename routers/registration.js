const express = require('express');
const dbConnection = require('../database/dbConnection');
const encryptPassword = require('./functions/encryptPassword');
const router = express.Router();

router.post('/users/register', async (req, res) => {
   const { username, emailAddress, password } = req.body;

   const encryptedPassword = await encryptPassword(password);

   const insertUserQuery = `INSERT INTO USER (
      username, email, password
   ) VALUES (
      '${username}', '${emailAddress}', '${encryptedPassword}'
   )`;

   dbConnection.query(insertUserQuery, (err) => {
      if (err) {
         const isUsernameAlreadyTaken = err.sqlMessage === `Duplicate entry '${username}' for key 'user.username'`;
         const isEmailAddressAlreadyBeingUsed = err.sqlMessage === `Duplicate entry '${emailAddress}' for key 'user.email'`;

         if (isUsernameAlreadyTaken) {
            res.status(400).send({ message: "This username is already taken" });
            return;
         } else if (isEmailAddressAlreadyBeingUsed) {
            res.status(400).send({ message: "This email address is already being used" });
            return;
         } else {
            console.error(err);
            res.status(400).send({ message: err });
            return;
         }
      }

      res.status(200).send({ message: `Registered user: ${username}` });
   })
});

module.exports = router;