const express = require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const { broadcast } = require('../services/messageBroadcaster');
const { Message, User } = require('../models');
const logger = require('../utils/logger');


const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const messages = await Message.findAll({
    where: {
      recipientId: userId
    },
    include: [
      {
        model: User,
        as: 'Sender',
        attributes: ['username']
      }
    ],
    order: [['timestamp', 'ASC']]

  });
  // Flatten Sender.username into the top-level "username"
  const response = messages.map((msg) => {
    const { Sender, ...rest } = msg.toJSON();
    return {
      ...rest,
      username: Sender?.username || 'Unknown'
    };
  });
  res.json({ messages: response });
});

router.post('/send', authenticateToken, async (req, res) => {
  const { content, recipientId } = req.body;
  const senderId = req.user.userId;

  if (!content || !recipientId) {
    return res.status(400).json({ error: 'Message content or recipientId' });
  }

  const message = await Message.create({
    senderId,
    recipientId,
    content,
    timestamp: new Date()
  });

  logger.info('Message sent', {
    senderId: req.user.userId,
    contentPreview: content.slice(0, 30)
  });

  // brodcast msg to all connected users
  broadcast({
    senderId: req.user.userId,
    username: req.user.username,
    content,
    timestamp: new Date()
  });
  res.status(201).json({
    message: {
      id: message.id,
      senderId: message.senderId,
      content,
      timestamp: message.timestamp
    }
  });
});

module.exports = router;
