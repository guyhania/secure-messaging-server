const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { User } = require('../models'); // Sequelize model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const {
    username,
    password,
    publicKey,
    encryptedPrivateKey,
    salt,
    iv
  } = req.body;

  // Validate required fields
  if (!username || !password || !publicKey || !encryptedPrivateKey || !salt || !iv) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      password: hashedPassword,
      publicKey,
      encryptedPrivateKey,
      salt,
      iv
    });

    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    console.error(err);
    // if (err.name === 'SequelizeUniqueConstraintError') {
    //   return res.status(409).json({ error: 'Username already exists' });
    // }
    res.status(500).json({ error: 'User already exists or DB error', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    logger.warn('Failed login attempt', { username });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  logger.info('User logged in', { username: user.username, userId: user.id });

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({
    message: 'Login successful',
    token,
    publicKey: user.publicKey,
    encryptedPrivateKey: user.encryptedPrivateKey,
    salt: user.salt,
    iv: user.iv
  });
});

module.exports = router;
