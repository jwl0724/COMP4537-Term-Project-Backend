const bcrypt = require("bcryptjs");

const login = async function(req, res, db) {
    const user = await db.getUser(req.body.email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(req.body.password, user.password);

    // Obviously this needs to be changed to some more legit auth service (maybe find some middleware?)
    if (match) res.sendStatus(200);
    else if (!match) return res.status(401).json({ error: "Invalid credentials" });
}

const signup = async function(req, res, db) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const output = await db.writeUser(req.body.email, hashedPassword);
    if (!output) return res.status(500).json({ error: "Error creating user" });
    else console.log(output);
    res.sendStatus(200); // Again find a means to redirect
}

exports.login = login;
exports.signup = signup;