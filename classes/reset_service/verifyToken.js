const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Ensure your JWT_SECRET is stored in your .env file

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach decoded user data to the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
