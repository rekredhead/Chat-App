/**
 * POST /profiles/uploadProfilePicture => Gets the user's uploaded profile picture and saves it, renamed with their username, in profile_pictures/
 * PUT /profiles/update => Updates the user's profile bio in the database
 * GET /profiles/users => Sends a list of all usernames in the database
 * GET /profiles/users/:username => Sends the username and bio of a specific user's profile data
 * GET /profiles/users/me => Sends the current user's username and bio in the database.
 *    It will create an empty dataset ( empty bio ) for the user in the profile table if they don't already have a profile saved
 */

const express = require('express');
const path = require('path');
const multer = require('multer');
const dbConnection = require('../database/dbConnection');
const router = express.Router();

// Files are stored in 'profile_pictures' directory and renamed with user's username
const storage = multer.diskStorage({
   destination: './profile_pictures',
   filename: (req, file, cb) => {
      const username = req.session.username;
      const filename = username + '.png';
      cb(null, filename);
   }
});
const upload = multer({ storage });

router.post('/profiles/uploadProfilePicture', (req, res) => {
   // It would be safer to validate whether req.session.username is a username in the DB - not bothered to implement it

   upload.single('picture')(req, res, (err) => { // 'picture' is the name of the input from the HTML form
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
   const username = req.session.username;
   const { bio } = req.body;

   const updateUserProfileDataQuery = `UPDATE PROFILE SET bio='${bio}' WHERE username='${username}'`;
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
      SELECT username, bio
      FROM PROFILE
      WHERE username='${username.slice(1)}'
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
   const username = req.session.username;

   const getUserProfileData = `
      SELECT username, bio
      FROM PROFILE
      WHERE username='${username}'
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

      const insertEmptyProfileDataQuery = `INSERT INTO PROFILE ( username, bio ) VALUES ( '${username}', '' )`;
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