const express = require('express');
const bcrypt = require('bcrypt');
const dbConnection = require('../database/dbConnection');
const router = express.Router();

router.use('/login', express.static("./client/login-page"));

router.post('/users/login', (req, res) => {
   const { username, password } = req.body;

   const getMatchingDataQuery = `SELECT userID,password FROM USER WHERE username='${username}'`;
   dbConnection.query(getMatchingDataQuery, async(err, result) => {
      if (err) throw err;
      const isUserInDatabase = result.length === 1;

      if (!isUserInDatabase) {
         res.status(400).send({message: "Username not found"});
         return;
      }

      const userIDInDB = result[0].userID;
      const userPasswordInDB = result[0].password;
      const doesPasswordMatch = await bcrypt.compare(password, userPasswordInDB);

      if (!doesPasswordMatch) {
         res.status(400).send({message: "Incorrect Password"});
         return;
      }

      req.session.userID = userIDInDB;
      res.status(200).send({message: "User is verified"});
      // res.redirect("/chat");
   });
});

module.exports = router;