const chat = require("./chat_service/chat");
const auth = require("./auth_service/auth");
const reset = require("./reset_service/reset");
const DataController = require("./data_service/dataController");
const { verifyToken } = require("./utils/token");

function build(app, database) {
    const dataController = new DataController(database);
    // Auth services
    app.post("/login", (req, res, next) => auth.login(req, res, database, next));
    app.post("/signup", (req, res, next) => auth.signup(req, res, database, next));
    app.post("/logout", (req, res) => auth.logout(req, res))

    // Password reset services
    app.post("/reset", verifyToken, (req, res, next) => reset.reset(req, res, database, next));

    // Chat services
    app.post("/chat", verifyToken, (req, res, next) => chat.getChat(req, res, database, next));

    // forgot-password
    app.post("/forgot-password", async (req, res, next) => {
        try {
            await reset.reset(req, res, database);
        } catch (error) {
            next(error);
        }
    });

    // Data services
    app.get("/me", verifyToken, (req, res, next) => dataController.getMe(req, res, database, next));
    app.get("/get-all-users", verifyToken, (req, res, next) => dataController.getAllUserData(req, res, database, next));
    app.get("/api-stats", verifyToken, (req, res, next) => dataController.getUserApiStats(req, res, database, next));
    app.get("/endpoint-stats", verifyToken, (req, res, next) => dataController.getEndpointStats(req, res, database, next));
}

exports.build = build;