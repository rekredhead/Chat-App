const express = require('express');
const router = express.Router();

router.use('/chat', express.static('./index.html'));

module.exports = router;