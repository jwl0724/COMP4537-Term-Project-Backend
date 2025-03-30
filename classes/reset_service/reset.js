// // // const { v4: uuidv4 } = require('uuid');
// // // const bcrypt = require('bcryptjs');
// // // const nodemailer = require('nodemailer');
// // // const MySQL = require('../database/mysql');

// // // // Initialize the MySQL instance
// // // const db = new MySQL();

// // // // Setup email transport
// // // const transporter = nodemailer.createTransport({
// // //     service: 'gmail',
// // //     auth: {
// // //         user: process.env.EMAIL_USER,
// // //         pass: process.env.EMAIL_PASSWORD
// // //     }
// // // });

// // // // Send reset email
// // // async function sendResetEmail(email, token) {
// // //     const resetLink = `http://127.0.0.1:8080/reset-password?token=${token}`;  // Your frontend reset URL
// // //     const mailOptions = {
// // //         from: process.env.EMAIL_USER,  // Use environment variable for security
// // //         to: email,
// // //         subject: 'Password Reset Request',
// // //         text: `Please click the following link to reset your password: ${resetLink}`,
// // //         html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
// // //     };

// // //     try {
// // //         await transporter.sendMail(mailOptions);
// // //     } catch (error) {
// // //         console.error('Error sending email:', error);
// // //     }
// // // }

// // // // Password reset handler
// // // const reset = async function (req, res, db, next) {
// // //     try {
// // //         const { email } = req.body;
// // //         const user = await db.readUser(email);
        
// // //         if (!user) {
// // //             return res.status(400).json({ error: 'User not found' });
// // //         }

// // //         // Generate a unique reset token
// // //         const token = uuidv4();
// // //         const expirationTime = new Date(Date.now() + 3600000); // 1 hour expiration

// // //         // Store token in the database
// // //         const tokenStored = await db.storePasswordResetToken(email, token, expirationTime);

// // //         if (!tokenStored) {
// // //             throw new Error('Failed to store token');
// // //         }

// // //         // Send reset email
// // //         await sendResetEmail(email, token);

// // //         res.status(200).json({ message: 'Password reset email sent' });

// // //     } catch (error) {
// // //         next(error);
// // //     }
// // // };

// // // // Token verification handler
// // // const verifyToken = async function (req, res, next) {
// // //     const { token } = req.query;  // Token comes from query parameters
// // //     if (!token) {
// // //         return res.status(400).json({ error: 'Token is required' });
// // //     }

// // //     const tokenData = await db.getPasswordResetToken(token);
// // //     if (!tokenData || new Date() > new Date(tokenData.expiration_time)) {
// // //         return res.status(400).json({ error: 'Invalid or expired token' });
// // //     }

// // //     req.email = tokenData.email; // Add user email to request for password reset
// // //     next();
// // // };


// // // module.exports = { reset, verifyToken, resetPassword };
// // // reset_service/reset.js
// // const { v4: uuidv4 } = require('uuid');
// // const nodemailer = require('nodemailer');
// // const MySQL = require('../database/mysql');

// // // Initialize the MySQL instance
// // const db = new MySQL();

// // // Setup email transport
// // const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //         user: process.env.EMAIL_USER, // Use your actual email address from env
// //         pass: process.env.EMAIL_PASSWORD // Use your actual email password or app password
// //     }
// // });

// // // Function to send the reset email
// // async function sendResetEmail(email) {
// //     const mailOptions = {
// //         from: process.env.EMAIL_USER,  // From your email
// //         to: email,                     // To the email provided in the request
// //         subject: 'Password Reset Request',
// //         text: 'This is a blank email for the password reset request.'
// //     };

// //     // Send the email
// //     await transporter.sendMail(mailOptions);
// // }






// // module.exports = { reset };

// const { v4: uuidv4 } = require('uuid');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const MySQL = require('../database/mysql');

// // Initialize MySQL connection
// const db = new MySQL();

// // Setup email transport
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASSWORD 
//     }
// });

// // Function to send the reset email
// async function sendResetEmail(email, token) {
//     const resetLink = `http://localhost:8080/reset-password?token=${token}`;  // Reset link URL
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Password Reset Request',
//         text: `Please click the following link to reset your password: ${resetLink}`,
//         html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
//     };

//     // Send the reset email
//     await transporter.sendMail(mailOptions);
// }

// // Forgot Password service: generates a reset token and sends it to the user
// const forgotPassword = async function(req, res, db, next) {
//     try {
//         const { email } = req.body;
//         const user = await db.getUser(email); // Get user from DB
        
//         if (!user) return res.status(404).json({ error: "User not found" });

//         // Generate a password reset token (JWT) that expires in 1 hour
//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send reset email with the token link
//         await sendResetEmail(email, token);

//         res.status(200).json({ message: "Password reset email sent" });

//     } catch (error) {
//         console.error("Password reset error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
// const resetPassword = async function (req, res, next) {
//     try {
//         const { email, newPassword } = req.body;

//         // Step 1: Check if email is provided
//         if (!email) {
//             return res.status(400).json({ error: "Email is required" });
//         }

//         // Step 2: Generate the reset token
//         const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
//         // Step 3: Send reset email (this part is just a conceptual example)
//         // In a real-world scenario, you would send the token to the user's email
//         // e.g., sendEmail(email, `http://yourapp.com/reset-password?token=${token}`);
//         // Step 2: Get the user by email from the database
//         const user = await db.getUserByEmail(email); // Fetch user from DB using email
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }
        
//         // res.status(200).json({ message: "Password reset email sent" });

//     } catch (error) {
//         console.error("Password reset error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // Reset the password after user clicks on the reset link
// const resetPasswordWithToken = async function (req, res, next) {
//     try {
//         const { token, newPassword } = req.body;

//         // Step 1: Verify the Token
//         if (!token) {
//             return res.status(400).json({ error: "Token is required" });
//         }

//         // Verify token and extract the email
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (!decoded || !decoded.email) {
//             return res.status(400).json({ error: "Invalid or expired token" });
//         }

//         const email = decoded.email;
//         console.log("email = ", email)

//         // Step 2: Get the user by email from the database
//         const user = await db.getUserByEmail(email);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Step 3: Hash the new password
//         const saltRounds = 12; // Adjust salt rounds as needed
//         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//         // Step 4: Update the password in the database
//         const updated = await db.updateUserPassword(email, hashedPassword);
//         if (!updated) {
//             return res.status(500).json({ error: "Failed to update password" });
//         }

//         // Optionally remove the reset token from the database after successful password change
//         await db.deletePasswordResetToken(email);

//         res.status(200).json({ message: "Password successfully reset" });
//     } catch (error) {
//         console.error("Password reset error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = { forgotPassword, resetPassword };
