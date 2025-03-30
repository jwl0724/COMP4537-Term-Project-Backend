const logApi = (database) => {
    return async (req, res, next) => {
        if (req.user && req.user.email) {
            try {
                await database.logApiCall(req.method, req.path, req.user.email);
            } catch (err) {
                console.error("API log failed:", err.message);
            }
        }
        next();
    };
};

module.exports = { logApi };
