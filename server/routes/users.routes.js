const express = require('express');
const router = express.Router();

const { User } = require('../models');
const { getOnlineUserIds } = require('../services/messageBroadcaster');

router.get('/online', async (req, res) => {
  const ids = getOnlineUserIds();

  const users = await User.findAll({
    where: { id: ids },
    attributes: ['id', 'username', 'publicKey']
  });

  res.json({ users });
});
module.exports = router; 