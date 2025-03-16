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
