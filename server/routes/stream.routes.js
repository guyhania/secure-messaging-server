const express = require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const { addClient } = require('../services/messageBroadcaster');

const router = express.Router();

router.get('/stream', authenticateToken, (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });

    res.flushHeaders();
    res.write('event: connected\ndata: connected\n\n');

    const userId = req.user.userId;
    addClient(userId, res);
});

module.exports = router;
