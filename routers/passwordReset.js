/**
 * POST /users/password-reset/new-password => Sends password resetting verification code to user's email
 * Request body: username, newPassword
 * 
 * POST /users/password-reset/verification => Verifies the code and changes the user's password in Database
 * Request body: username, verificationCode
 * 
 * This file contains two APIs to verify the user through email verification before allowing them to change their password in the database.
 * /new-password :
 *    A search query is done to check if the username is in the database. If not, it will send an appropriate message to the client.
 *    Then it will generate a random code and caches it in Redis as { username: { verificationCode, newPassword } }
 *    Then it will send the code to the user's email. If an error occurs, it will send an appropriate message to the client.
 *    Then it will send an OK message to the client stating the verification code has been sent.
 * 
 * /verification :
 *    A search query is done to check if the username is in the database. If not, it will send an appropriate message to the client.
 *    Then it will get the data from the Redis cache. If it's not cached, it will send a 'code has expired' message to the client.
 *    Then it will check if the user-entered code matches with the cached code. If not, it will send a 'incorrect code' message to the client.
 *    Then it will delete the cached data of the user from Redis ( to reduce excessive caching ).
 *    Then it will encrypt the new password and update the user's password in the database. Then sends an OK response to client.
 */

const express = require('express');
const dbConnection = require('../database/dbConnection');
const isVerificationEmailSent = require('./functions/sendVerificationCodeToEmail');
const encryptPassword = require('./functions/encryptPassword');
const { cachePasswordResettingData, getPasswordResettingDataFromCache, deleteDataFromCache } = require('./functions/handleRedisCaching');
const router = express.Router();

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

   const findUsernameInDBQuery = `SELECT email FROM USER WHERE username='${username}'`;
   dbConnection.query(findUsernameInDBQuery, async(err, result) => {
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }
      if (result.length === 0) {
         res.status(400).send({ message: "Username not found" });
         return;
      }

      const verificationCode = generateRandomCode(username);
      await cachePasswordResettingData(username, newPassword, verificationCode);

      const email = result[0].email;
      if (!isVerificationEmailSent(email, verificationCode)) {
         res.status(400).send({ message: "Error with sending verification code. Please try again"});
         return;
      }
      
      res.status(200).send({ message: `Verification Code was sent to ${email}. Code will expire in 300 seconds`});
   });
});

router.post('/users/password-reset/verification', (req, res) => {
   const { username, verificationCode } = req.body;

   const findUsernameInDBQuery = `SELECT email FROM USER WHERE username='${username}'`;
   dbConnection.query(findUsernameInDBQuery, async(err, result) => {
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }
      if (result.length === 0) {
         res.status(400).send({ message: "Username not found" });
         return;
      }

      const cachedPasswordResetData = await getPasswordResettingDataFromCache(username);

      const isUsernameInCachedData = Object.entries(cachedPasswordResetData).length > 0;
      if (!isUsernameInCachedData) {
         res.status(400).send({ message: "This verification code has expired. Please try again" });
         return;
      }

      const isVerificationCodeCorrect = cachedPasswordResetData.verificationCode === verificationCode;
      if (!isVerificationCodeCorrect) {
         res.status(400).send({ message: "Incorrect verification code" });
         return;
      }

      await deleteDataFromCache(username);

      // Update password for the user in the database
      const newEncryptedPassword = await encryptPassword(cachedPasswordResetData.password);
      const updateUserPasswordQuery = `UPDATE USER SET password='${newEncryptedPassword}' WHERE username='${username}'`;
      dbConnection.query(updateUserPasswordQuery, (err) => {
         if (err) throw err;
         res.status(200).send({ message: "Password changed successfully" });
      });
   });
});

module.exports = router;