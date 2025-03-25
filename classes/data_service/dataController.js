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

            await this.db.deleteUser(email);
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DataController;