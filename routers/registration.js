const express = require('express');
const router = express.Router();

router.use('/registration', express.static("./client/registration-page"));

module.exports = router;