const express = require('express');
const router = express.Router();
const chatSocket = require('../chatSocket');

router.use('/chat', express.static("./client"));

router.use((req, res, next) => {
   chatSocket(req.app.get('httpServer'));
   next();
});

module.exports = router;