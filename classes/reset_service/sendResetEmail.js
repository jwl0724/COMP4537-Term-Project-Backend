const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",  // You can replace with another email provider
        auth: {
            user: process.env.EMAIL_USER,  // Your email (e.g., your Gmail)
            pass: process.env.EMAIL_PASS   // Your email password or app-specific password
        }
    });

    const resetUrl = `https://yourfrontend.com/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email
        to: email,                   // Recipient's email
        subject: "Password Reset Request",
        text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending reset email:", error);
    }
};
