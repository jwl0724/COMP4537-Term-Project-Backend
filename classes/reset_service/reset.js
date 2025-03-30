const nodemailer = require('nodemailer');

async function forgotPassword(req, res, db, next) {
    try {
        const email = req.body.email;

        if (!email) {
            const error = new Error("Email is required");
            error.status = 400;
            throw error;
        }

        const user = await db.getUser(email);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        // Generate reset token (e.g., using JWT or a random token)
        const resetToken = generateResetToken(email);

        // Send email with the reset link (using nodemailer)
        await sendResetEmail(email, resetToken);

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

    const resetLink = `https://comp-4537-term-project-frontend-three.vercel.app/reset-password?token=${resetToken}`;

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
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    return token;
}

module.exports = { forgotPassword, sendResetEmail, generateResetToken };