// server/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const helmet = require('helmet');
const routes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/messages.routes');
const streamRoutes = require('./routes/stream.routes');
const userRoutes = require('./routes/users.routes');


const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/messages', streamRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/', (req, res) => {
  res.send('Secure Messaging Server is up and running.');
});

module.exports = app;
