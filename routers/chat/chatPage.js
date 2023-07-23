const express = require('express');
const router = express.Router();
const chatSocket = require('./chatSocket');

// Use the websocket connection
router.use((req, res, next) => {
   chatSocket(req.app.get('httpServer'));
   next();
});

module.exports = router;