const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
class DataController {

    constructor(database) {
        this.db = database;
    }

    async getAllUserData(req, res, next) {
        try {
            const users = await this.db.getAllUsers();

            if (!users || users.length === 0) {
                const err = new Error("No users found");
                err.status = 404;
                throw err;
            }

            res.json(users.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role,
                api_calls_left: user.api_calls_left
            })));
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const userEmail = req.user.email;
            const user = await this.db.getUser(userEmail);

            if (!user) {
                const error = new Error("User not found");
                error.status = 404;
                throw error;
            }

            res.json({
                email: user.email,
                role: user.role,
                api_calls_left: user.api_calls_left
            });
        } catch (error) {
            next(error);
        }
    }

    async updateApiCallsLeft(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                const err = new Error("Forbidden: Admins only");
                err.status = 403;
                throw err;
            }

            const { email, api_calls_left } = req.body;

            if (!email || typeof api_calls_left !== "number") {
                const err = new Error("Invalid body. Use email and api_calls_left");
                err.status = 400;
                throw err;
            }

            await this.db.updateApiCallsLeft(email, api_calls_left);
            res.json({ message: "API calls updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                const err = new Error("Forbidden: Admins only");
                err.status = 403;
                throw err;
            }

            const { email, role } = req.body;

            if (!email || !role || !["user", "admin"].includes(role)) {
                const err = new Error("Invalid input. Provide a valid email and role ('user' or 'admin')");
                err.status = 400;
                throw err;
            }

            const result = await this.db.updateRole(email, role);
            if (result.affectedRows === 0) {
                const err = new Error("User not found");
                err.status = 404;
                throw err;
            }

            const apiCallsLeft = role === "admin" ? -1 : 20;
            await this.db.updateApiCallsLeft(email, apiCallsLeft);

            res.json({ message: "User role and API call limit updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    async getEndpointStats(req, res, next) {
        try {
            const stats = await this.db.getEndpointStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getApiStats(req, res, next) {
        try {
            const stats = await this.db.getApiStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            if (req.user.role !== "admin") {
                const err = new Error("Forbidden: Admins only");
                err.status = 403;
                throw err;
            }

            const { email } = req.body;

            if (!email) {
                const err = new Error("Missing email");
                err.status = 400;
                throw err;
            }

            const result = await this.db.deleteUser(email);

            if (result.affectedRows === 0) {
                const err = new Error("User not found");
                err.status = 404;
                throw err;
            }

            res.json({ message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    async updatePassword(req, res, next) {
        try {
          const { currentPassword, newPassword } = req.body;
    
          if (!currentPassword || !newPassword) {
            const err = new Error("Both current and new passwords are required");
            err.status = 400;
            throw err;
          }
    
          const user = await this.db.getUser(req.user.email);
          if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
          }
    
          // Check if current password is correct
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
            const error = new Error("Current password is incorrect");
            error.status = 400;
            throw error;
          }
    
          // Hash the new password
          const hashedPassword = await bcrypt.hash(newPassword, 12);
    
          // Update password in the database
          const updateSuccess = await this.db.updateUserPassword(req.user.email, hashedPassword);
          if (!updateSuccess) {
            const err = new Error("Failed to update password");
            err.status = 500;
            throw err;
          }
    
          res.json({ message: "Password updated successfully" });
        } catch (error) {
          next(error);
        }
      }

      async resetPassword(req, res, next) {
        try {
          const { token, newPassword } = req.body;
    
          if (!token || !newPassword) {
            const err = new Error("Token and new password are required");
            err.status = 400;
            throw err;
          }
    
          // Decode the token
          const decoded = jwt.verify(token, JWT_SECRET);
    
          const userEmail = decoded.email;
          const user = await this.db.getUser(userEmail);
          if (!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
          }
    
          // Hash the new password
          const hashedPassword = await bcrypt.hash(newPassword, 12);
    
          // Update password in the database
          const updateSuccess = await this.db.updateUserPassword(userEmail, hashedPassword);
          if (!updateSuccess) {
            const err = new Error("Failed to reset password");
            err.status = 500;
            throw err;
          }
    
          res.json({ message: "Password reset successfully" });
        } catch (error) {
          next(error);
        }
      }
    

    // async resetPassword(req, res, next) {
    //     try {
    //         const { email, newPassword } = req.body;

    //         // Step 1: Validate input
    //         if (!email || !newPassword) {
    //             const err = new Error("Email and new password are required");
    //             err.status = 400;
    //             throw err;
    //         }

    //         // Step 2: Check if user exists
    //         const user = await this.db.getUser(email); // Use the Repository's getUser method
    //         if (!user) {
    //             const err = new Error("User not found");
    //             err.status = 404;
    //             throw err;
    //         }

    //         // Step 3: Hash the new password
    //         const hashedPassword = await bcrypt.hash(newPassword, 12); // Use bcrypt to hash

    //         // Step 4: Update the password in the database
    //         const updateSuccess = await this.db.updateUserPassword(email, hashedPassword); // Call updateUserPassword
    //         if (!updateSuccess) {
    //             const err = new Error("Failed to update password");
    //             err.status = 500;
    //             throw err;
    //         }

    //         // Step 5: Respond with success
    //         res.json({ message: "Password successfully reset" });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async forgotPassword(req, res, next) {
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
    async sendResetEmail(email, resetToken) {
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
    generateResetToken(email) {
        // Generate a token using JWT, random string, or another secure method
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' }); // Example 5 minute expiration
        return token;
    }
}

module.exports = DataController;