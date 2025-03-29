require("dotenv").config();
const bcrypt = require("bcryptjs");
const { generateToken, setTokenCookie } = require("../utils/token");

const login = async (req, res, db, next) => {
    try {
        const user = await db.getUser(req.body.email);
        if (!user) throw new Error("User not found");

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw new Error("Invalid credentials");

        const token = generateToken(user);

        setTokenCookie(res, token);

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        next(error);
    }
};

const signup = async (req, res, db, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error("Email and password are required");
        }

        const existingUser = await db.getUser(req.body.email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const saltRounds = Math.floor(Math.random() * 3) + 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const role = "user";
        const apiCallsLeft = 20;

        const output = await db.writeUser(req.body.email, hashedPassword, role, apiCallsLeft, req.body.user_name);
        if (!output) {
            throw new Error("Error creating user");
        }

        const token = generateToken({ email: req.body.email, role });

        setTokenCookie(res, token);

        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.clearCookie("token");  // Clear the JWT token cookie
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { login, signup, logout };