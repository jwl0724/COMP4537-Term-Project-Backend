const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
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
                user_name: user.user_name,
                email: user.email,
                role: user.role,
                api_calls_left: user.api_calls_left,
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
                user_name: user.user_name,
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
            const saltRounds = Math.floor(Math.random() * 3) + 12;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password in the database
            const updateSuccess = await this.db.updatePassword(req.user.email, hashedPassword);
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
}

module.exports = DataController;