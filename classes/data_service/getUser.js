async function getUserData(req, res, database, next) {
    try {
        const userEmail = req.user.email;

        const user = await database.getUser(userEmail);

        // Check if user was found
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
};

module.exports = getUserData;