const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecuredevsecret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromQuery = req.query.token;
  
  const token = tokenFromHeader || tokenFromQuery;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user; // Add user payload to request
    next();
  });
}

module.exports = authenticateToken;
