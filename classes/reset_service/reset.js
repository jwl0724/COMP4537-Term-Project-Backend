const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const forgotPassword = async (req, res, db, next) => {
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

        const resetToken = generateResetToken(email);
        await sendResetEmail(email, resetToken);

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        next(error);
    }
};

const sendResetEmail = async (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
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
};

const generateResetToken = (email) => {
    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
        return token;
    } catch (error) {
        const err = new Error("Error generating token: " + error.message);
        err.status = 500;
        throw err;
    }
}

module.exports = { forgotPassword, sendResetEmail, generateResetToken };