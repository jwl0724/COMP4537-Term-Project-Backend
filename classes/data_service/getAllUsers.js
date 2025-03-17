async function getAllUserData(req, res, database, next) {
    try {
        const users = await database.getAllUsers();

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
};

module.exports = getAllUserData;
