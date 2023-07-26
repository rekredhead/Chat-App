const express = require('express');
const path = require('path');
const multer = require('multer');
const dbConnection = require('../database/dbConnection');
const router = express.Router();

// Save the username as the session cookie instead of userID in worst case

// Files are stored in 'profile_pictures' directory and renamed with user's username
const storage = multer.diskStorage({
   destination: './profile_pictures',
   filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const username = req.body.username;
      const filename = username + extension;
      cb(null, filename);
   }
});

const upload = multer({ storage });

router.post('/profiles/uploadProfilePicture', (req, res) => {
   // 'picture' is the name of the input from the HTML form
   upload.single('picture')(req, res, (err) => {
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }

      if (!req.file) {
         res.status(400).send({ message: "No file was uploaded" });
         return;
      }

      const validExtensions = ['.jpeg', '.jpg', '.png'];
      const fileExtension = path.extname(req.file.originalname).toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
         res.status(400).send({ message: 'Cannot accept this image format. Please use jpeg, jpg or png' });
         return;
      }

      res.status(200).send({ message: "Profile picture was uploaded" });
   });
});

router.put('/profiles/update', (req, res) => {
   const userID = req.session.userID;
   const { bio } = req.body;

   const updateUserProfileDataQuery = `UPDATE PROFILE SET bio='${bio}' WHERE userID='${userID}'`;
   dbConnection.query(updateUserProfileDataQuery, (err) => {
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }
      res.status(200).send({ message: "Updated Profile" });
   });
});

router.get('/profiles/users', (req, res) => {
   const getAllUsernamesQuery = 'SELECT username FROM USER';
   dbConnection.query(getAllUsernamesQuery, (err, result) => {
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }
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
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }

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
      if (err) {
         console.error(err);
         res.status(400).send({ message: err });
         return;
      }

      // Send profile data to frontend - insert empty data into PROFILE table if no data of user is present
      const isUserInDatabase = result.length > 0;
      if (isUserInDatabase) {
         res.status(200).send(result[0]);
         return;
      }

      const insertEmptyProfileDataQuery = `INSERT INTO PROFILE ( userID, bio ) VALUES ( ${userID}, '' )`;
      dbConnection.query(insertEmptyProfileDataQuery, (err) => {
         if (err) {
            console.error(err);
            res.status(400).send({ message: err });
            return;
         }

         // Get profile data again and then send it to frontend
         dbConnection.query(getUserProfileData, (err, result) => {
            if (err) {
               console.error(err);
               res.status(400).send({ message: err });
               return;
            }

            res.status(200).send(result[0]);
         });
      });
   });
});

module.exports = router;