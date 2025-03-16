const bcrypt = require("bcryptjs");

const login = async function (req, res, db, next) {
    try {
        const user = await db.getUser(req.body.email);
        if (!user) throw new Error("User not found");

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw new Error("Invalid credentials");

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

const signup = async function (req, res, db, next) {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error("Email and password are required");
        }

        const existingUser = await db.getUser(req.body.email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const output = await db.writeUser(req.body.email, hashedPassword);
        if (!output) {
            throw new Error("Error creating user");
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

module.exports = { login, signup };