/**
 * Use the websocket connection from chatSocket.js for this router to enable send and receive user messages without latency
 */

const express = require('express');
const router = express.Router();
const chatSocket = require('./chatSocket');

// Use the websocket connection
router.use((req, res, next) => {
   chatSocket(req.app.get('httpServer'));
   next();
});

module.exports = router;