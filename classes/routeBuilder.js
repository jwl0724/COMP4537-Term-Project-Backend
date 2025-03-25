const chat = require("./chat_service/chat");
const auth = require("./auth_service/auth");
const reset = require("./reset_service/reset");
const DataController = require("./data_service/dataController");
const { logApi } = require("./utils/logApi");
const { verifyToken } = require("./utils/token");

function build(app, db) {
    const dataController = new DataController(db);

    // Auth services
    app.post("/login", (req, res, next) => auth.login(req, res, db, next));
    app.post("/signup", (req, res, next) => auth.signup(req, res, db, next));
    app.post("/logout", (req, res) => auth.logout(req, res))

    // Password reset services
    app.post("/reset", verifyToken, logApi(db), (req, res, next) => reset.reset(req, res, db, next));

    // Chat services
    app.post("/chat", verifyToken, logApi(db), (req, res, next) => chat.getChat(req, res, db, next));

    // forgot-password
    app.post("/forgot-password", async (req, res, next) => {
        try {
            await reset.reset(req, res, db);
        } catch (error) {
            next(error);
        }
    });

    // Data services
    app.get("/me", verifyToken, logApi(db), (req, res, next) => dataController.getMe(req, res, db, next));
    app.get("/get-all-users", verifyToken, logApi(db), (req, res, next) => dataController.getAllUserData(req, res, db, next));
    app.get("/api-stats", verifyToken, logApi(db), (req, res, next) => dataController.getApiStats(req, res, db, next));
    app.get("/endpoint-stats", verifyToken, logApi(db), (req, res, next) => dataController.getEndpointStats(req, res, db, next));
}

exports.build = build;