const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.token;  // Get token from cookies

    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user data to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

function generateToken(user) {
    const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time (1 hour)
    );
    return token;
}

function setTokenCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,   // Prevent JavaScript from accessing the cookie
        secure: true,  // Cookies sent only over https
        maxAge: 3600000  // 1 hour expiration
    });
}

module.exports = { verifyToken, generateToken, setTokenCookie };