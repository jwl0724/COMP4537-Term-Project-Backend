const chat = require("./chat_service/chat");
const auth = require("./auth_service/auth");
const reset = require("./reset_service/reset");
const getUserData = require("./data_service/getUser");
const getAllUserData = require("./data_service/getAllUsers");
const { verifyToken } = require("./utils/token");

function build(app, database) {
    // Auth services
    app.post("/login", (req, res, next) => auth.login(req, res, database, next));
    app.post("/signup", (req, res, next) => auth.signup(req, res, database, next));
    app.post("/logout", (req, res) => auth.logout(req, res))

    // Password reset services
    app.post("/reset", verifyToken, (req, res, next) => reset.reset(req, res, database, next));

    // Chat services
    app.post("/chat", verifyToken, (req, res) => chat.getChat(req, res));

    // forgot-password
    app.post("/forgot-password", async (req, res, next) => {
        try {
            await reset.reset(req, res, database);
        } catch (error) {
            next(error);
        }
    });

    // Data services
    app.get("/me", verifyToken, (req, res, next) => getUserData(req, res, database, next));
    app.get("/get-all-users", verifyToken, (req, res, next) => getAllUserData(req, res, database, next));

}

exports.build = build;