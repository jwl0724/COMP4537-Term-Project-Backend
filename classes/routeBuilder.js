const chat = require("./chat_service/chat");
const auth = require("./auth_service/auth");
const reset = require("./reset_service/reset");

function build(app, database) {
    // Auth services
    app.post("/login", (req, res) => auth.login(req, res, database));
    app.post("/signup", (req, res) => auth.signup(req, res, database));

    // Password reset services
    app.post("/reset", (req, res) => reset.reset(req, res, database));

    // Chat services
    app.post("/chat", (req, res) => chat.getChat(req, res));
}

exports.build = build;