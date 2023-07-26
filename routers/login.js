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