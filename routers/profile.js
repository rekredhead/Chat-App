const express = require('express');
const dbConnection = require('../database/dbConnection');
const router = express.Router();

router.use('/profile', express.static("./client/profile-page"));

/*
Save the profile pictures in profile_pictures/ in the main directory
Host all images in the directory
Save each picture as the user's username
Frontend will access the profile picture from the username and the hosted picture
Remove profilePictureLocation field in database if not needed
*/

router.put('/profiles/update', (req, res) => {
   const userID = req.session.userID;
   const { bio } = req.body;

   const updateUserProfileDataQuery = `UPDATE PROFILE SET bio='${bio}' WHERE userID='${userID}'`;
   dbConnection.query(updateUserProfileDataQuery, (err) => {
      if (err) throw err;
      res.status(200).send({ message: "Updated Profile" });
   });
});

router.get('/profiles/users', (req, res) => {
   const getAllUsernamesQuery = 'SELECT username FROM USER';
   dbConnection.query(getAllUsernamesQuery, (err, result) => {
      if (err) throw err;
      const usernames = result.map((element) => element.username);

      res.status(200).send({ usernames });
   });
});

router.get('/profiles/users/:username', (req, res) => {
   const { username } = req.params;

   const getUserProfileData = `
      SELECT u.username, p.bio
      FROM PROFILE AS p
      INNER JOIN USER AS u ON p.userID=u.userID
      WHERE u.username='${username.slice(1)}'
   `;
   dbConnection.query(getUserProfileData, (err, result) => {
      if (err) throw err;

      const isUserInDatabase = result.length > 0;
      if (!isUserInDatabase) {
         res.status(400).send({ message: "User not found" });
         return;
      }

      // Send user profile data
      res.status(200).send(result[0]);
   });
});

router.get('/profiles/me', (req, res) => {
   const userID = req.session.userID;

   const getUserProfileData = `SELECT u.username, p.bio
      FROM PROFILE AS p
      INNER JOIN USER AS u ON p.userID=u.userID
      WHERE u.userID=${userID}
   `;
   dbConnection.query(getUserProfileData, (err, result) => {
      if (err) throw err;

      // Send profile data to frontend - insert empty data into PROFILE table if no data of user is present
      const isUserInDatabase = result.length > 0;
      if (isUserInDatabase) {
         res.status(200).send(result[0]);
         return;
      }

      const insertEmptyProfileDataQuery = `INSERT INTO PROFILE ( userID, bio ) VALUES ( ${userID}, '' )`;
      dbConnection.query(insertEmptyProfileDataQuery, (err) => {
         if (err) throw err;

         // Get profile data again and then send it to frontend
         dbConnection.query(getUserProfileData, (err, result) => {
            if (err) throw err;

            res.status(200).send(result[0]);
         });
      });
   });
});

// A Separate router for handling profile picture uploads

module.exports = router;