const jwt = require("jsonwebtoken");

const prodCookieOptions = {
    httpOnly: true,   // Prevent JavaScript from accessing the cookie
    secure: true,     // Cookies sent only over https
    sameSite: "None", // Cross-site cookies are allowed
    maxAge: 1000 * 60 * 60  // 1 hour expiration
}

const devCookieOptions = {
    httpOnly: true, // Prevents JS access to the cookie
    secure: false, // Must be false for HTTP (localhost). If true, browser will block the cookie
    sameSite: "Lax", // Allows sending cookies on same-site navigation and Swagger UI form submissions
    maxAge: 1000 * 60 * 60
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;  // Get token from cookies

    if (!token) {
        const error = new Error("Access denied, no token provided");
        error.status = 403;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded;  // Attach user data to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const generateToken = (user) => {
    try {
        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expiration time (1 hour)
        );
        return token;
    } catch (error) {
        const err = new Error("Error generating token: " + error.message);
        err.status = 500;
        throw err;  // Throw the error to be caught by next()
    }
}

const setTokenCookie = (res, token) => {
    try {
        const cookieOption = process.env.MODE === "production" ? prodCookieOptions : devCookieOptions;
        res.cookie("token", token, cookieOption);
    } catch (error) {
        const err = new Error("Error setting token cookie: " + error.message);
        err.status = 500;
        throw err;
    }
}

module.exports = { verifyToken, generateToken, setTokenCookie };