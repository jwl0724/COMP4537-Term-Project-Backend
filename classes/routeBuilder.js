const chat = require("./chat_service/chat");
const auth = require("./auth_service/auth");
const reset = require("./reset_service/reset");
const data = require("./data_service/getUser")
const { verifyToken } = require("./utils/token");

function build(app, database) {
    // Auth services
    app.post("/login", (req, res, next) => auth.login(req, res, database, next));
    app.post("/signup", (req, res, next) => auth.signup(req, res, database, next));
    app.post("/logout", (req, res) => auth.logout(req, res))

    // Password reset services
    app.post("/reset", (req, res, next) => reset.reset(req, res, database, next));

    // Chat services
    app.post("/chat", verifyToken, (req, res) => chat.getChat(req, res));

    // Check API calls left
    app.get("/get-user-data", verifyToken, (req, res, next) => data.getUserData(req, res, database, next));
}

exports.build = build;