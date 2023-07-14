const express = require('express');
const router = express.Router();

router.use('/password-reset', express.static("./client/password-reset-page"));

module.exports = router;