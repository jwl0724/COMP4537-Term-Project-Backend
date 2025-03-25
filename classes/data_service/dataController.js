class DataController {
    constructor(database) {
        this.db = database;
    }

    async getAllUserData(req, res, next) {
        try {
            const users = await this.db.getAllUsers();

            if (!users || users.length === 0) {
                return res.status(200).json({ message: "No users found", users: [] });
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

    async getEndpointStats(req, res, next) {
        try {
            const stats = await this.db.getEndpointStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getUserApiStats(req, res, next) {
        try {
            const stats = await this.db.getUserApiStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DataController;