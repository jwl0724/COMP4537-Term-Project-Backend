// const { v4: uuidv4 } = require('uuid');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const MySQL = require('../database/mysql');

// // Initialize the MySQL instance
// const db = new MySQL();

// // Setup email transport
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// // Send reset email
// async function sendResetEmail(email, token) {
//     const resetLink = `http://127.0.0.1:8080/reset-password?token=${token}`;  // Your frontend reset URL
//     const mailOptions = {
//         from: process.env.EMAIL_USER,  // Use environment variable for security
//         to: email,
//         subject: 'Password Reset Request',
//         text: `Please click the following link to reset your password: ${resetLink}`,
//         html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// }

// // Password reset handler
// const reset = async function (req, res, db, next) {
//     try {
//         const { email } = req.body;
//         const user = await db.readUser(email);
        
//         if (!user) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         // Generate a unique reset token
//         const token = uuidv4();
//         const expirationTime = new Date(Date.now() + 3600000); // 1 hour expiration

//         // Store token in the database
//         const tokenStored = await db.storePasswordResetToken(email, token, expirationTime);

//         if (!tokenStored) {
//             throw new Error('Failed to store token');
//         }

//         // Send reset email
//         await sendResetEmail(email, token);

//         res.status(200).json({ message: 'Password reset email sent' });

//     } catch (error) {
//         next(error);
//     }
// };

// // Token verification handler
// const verifyToken = async function (req, res, next) {
//     const { token } = req.query;  // Token comes from query parameters
//     if (!token) {
//         return res.status(400).json({ error: 'Token is required' });
//     }

//     const tokenData = await db.getPasswordResetToken(token);
//     if (!tokenData || new Date() > new Date(tokenData.expiration_time)) {
//         return res.status(400).json({ error: 'Invalid or expired token' });
//     }

//     req.email = tokenData.email; // Add user email to request for password reset
//     next();
// };

// // Password reset handler after token verification
// const resetPassword = async function (req, res, next) {
//     try {
//         const { newPassword } = req.body;
//         const { email } = req;

//         const saltRounds = Math.floor(Math.random() * 3) + 12;
//         const salt = await bcrypt.genSalt(saltRounds);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         const updated = await db.updateUserPassword(email, hashedPassword);

//         if (!updated) {
//             return res.status(500).json({ error: 'Failed to update password' });
//         }

//         // Remove the reset token from the database after successful password change
//         await db.deletePasswordResetToken(email);

//         res.status(200).json({ message: 'Password successfully reset' });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = { reset, verifyToken, resetPassword };
// reset_service/reset.js
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const MySQL = require('../database/mysql');

// Initialize the MySQL instance
const db = new MySQL();

// Setup email transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use your actual email address from env
        pass: process.env.EMAIL_PASSWORD // Use your actual email password or app password
    }
});

// Function to send the reset email
async function sendResetEmail(email) {
    const mailOptions = {
        from: process.env.EMAIL_USER,  // From your email
        to: email,                     // To the email provided in the request
        subject: 'Password Reset Request',
        text: 'This is a blank email for the password reset request.'
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

// Password reset service logic
// const reset = async function (req, res, db, next) {
//     try {
//         const { email } = req.body;
//         const user = await db.readUser(email);
        
//         if (!user) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         // Generate a reset token (optional if you're not using it yet)
//         const token = uuidv4();
//         const expirationTime = new Date(Date.now() + 3600000); // 1 hour expiration

//         // Store token in the database (optional step if you're not using the token yet)
//         const tokenStored = await db.storePasswordResetToken(email, token, expirationTime);

//         if (!tokenStored) {
//             throw new Error('Failed to store token');
//         }

//         // Send the blank email
//         await sendResetEmail(email);

//         res.status(200).json({ message: 'Password reset email sent' });

//     } catch (error) {
//         next(error);
//     }
// };
const reset = async function(req, res, db) {
    try {
        console.log("db object:", db);  // Log to check if it's the correct instance

        const { email } = req.body;
        const user = await db.getUser(email);
        console.log("User fetched:", user);

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





module.exports = { reset };
