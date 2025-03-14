const bcrypt = require("bcryptjs");

const login = async function(req, res, db) {
    const user = await db.getUser(req.body.email);
    if (!user) throw new Error(`Error getting user`);

    const match = await bcrypt.compare(req.body.password, user.password);

    // Obviously this needs to be changed to some more legit auth service (maybe find some middleware?)
    if (match) res.sendStatus(200);
    else throw new Error("Invalid credentials");
}

const signup = async function(req, res, db) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const output = await db.writeUser(req.body.email, hashedPassword);
    if (!output) throw new Error(`Error creating user`);
    else console.log(output);
    res.sendStatus(200); // Again find a means to redirect
}

exports.login = login;
exports.signup = signup;