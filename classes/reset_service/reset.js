const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

async function forgotPassword(req, res, next) {
    try {
        const email  = req.body.email;
        console.log("email ", email)
        console.log("req.body.email", req.body.email)
        
        if (!email) {
            const error = new Error("Email is required");
            error.status = 400;
            throw error;
        }

        const user = await this.db.getUser(email);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        // Generate reset token (e.g., using JWT or a random token)
        const resetToken = this.generateResetToken(email); // Implement this function

        // Send email with the reset link (using nodemailer)
        await this.sendResetEmail(email, resetToken); // Implement this function

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        next(error);
    }
}

// Helper to send reset email
async function sendResetEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or another email service
        auth: {
            user: process.env.EMAIL_USER,  // From environment variables
            pass: process.env.EMAIL_PASS   // From environment variables
        }
    });

    const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
}

// Helper to generate a reset token
function generateResetToken(email) {
    // Generate a token using JWT, random string, or another secure method
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' }); // Example 5 minute expiration
    return token;
}

module.exports = { forgotPassword, sendResetEmail, generateResetToken };