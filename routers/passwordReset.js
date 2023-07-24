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
      if (err) throw err;
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
      if (err) throw err;
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