const express = require('express');
const dbConnection = require('../database/dbConnection');
const isVerificationEmailSent = require('./functions/sendVerificationCodeToEmail');
const { cachePasswordResettingData, getPasswordResettingDataFromCache } = require('./functions/handleRedisCaching');
const router = express.Router();

router.use('/password-reset', express.static("./client/password-reset-page"));

const generateRandomCode = () => {
   let code = '';
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const codeLimit = 10;

   for (let i = 0; i < codeLimit; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
   }

   return code;
}

router.post('/users/password-reset/new-password', (req, res) => {
   const { username, newPassword } = req.body;

   const findUsernameInDBQuery = `SELECT username,email FROM USER WHERE username='${username}'`;
   dbConnection.query(findUsernameInDBQuery, async(err, result) => {
      if (err) throw err;
      if (result.length === 0) {
         res.status(400).send({ message: "Username not found" });
         return;
      }

      const verificationCode = generateRandomCode();
      await cachePasswordResettingData(username, newPassword, verificationCode);

      // Send verification code to user email
      const email = result[0].email;
      if (!isVerificationEmailSent(email, verificationCode)) {
         res.status(400).send({ message: "Error with sending verification code. Please try again"});
         return;
      }
      
      res.status(200).send({ message: `Verification Code was sent to ${email}. Code will expire in 300 seconds`});
   });
});

router.post('/users/password-reset/verification', (req, res) => {
   // Get userID from session, verificationCode from req.body
   // Check if userID is cached in Redis - send error if not
   // Check if verificationCode matches cached verificationCode
   // Update the new password of user in database
});

module.exports = router;