const express = require('express');
const router = express.Router();

router.use('/chat', express.static("./client"));

module.exports = router;