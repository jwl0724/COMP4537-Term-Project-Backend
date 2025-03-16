const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const reset = async function(req, res, db) {
    try {
        const { email } = req.body;

        const user = await db.getUser(email);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Generate a password reset token (JWT) that expires in 1 hour
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send reset email with the token link
        await sendResetEmail(email, token);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.reset = reset;
