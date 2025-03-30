// This code was assisted by ChatGPT, OpenAI.

class DataController {

    constructor(database) {
        this.db = database;
    }

    getAllUserData = async (req, res, next) => {
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

    getMe = async (req, res, next) => {
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

    updateApiCallsLeft = async (req, res, next) => {
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

    updateRole = async (req, res, next) => {
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

    getEndpointStats = async (req, res, next) => {
        try {
            const stats = await this.db.getEndpointStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    getApiStats = async (req, res, next) => {
        try {
            const stats = await this.db.getApiStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    deleteUser = async (req, res, next) => {
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
}

module.exports = DataController;