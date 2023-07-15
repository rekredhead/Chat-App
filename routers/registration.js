const express = require('express');
const router = express.Router();

router.use('/registration', express.static("./client/registration-page"));

router.post('/users/register', (req, res) => {
   const { username, emailAddress, password} = req;
   // Create the database first
});

module.exports = router;