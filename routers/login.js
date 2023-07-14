const express = require('express');
const router = express.Router();

router.use('/login', express.static("./client/login-page"));

module.exports = router;