const express = require("express");
const clearResources = require("./utils/cleaner");
const { logApi } = require("./utils/logApi");
const { verifyToken } = require("./utils/token");
const AuthService = require("./auth_service/auth");
const ChatService = require("./chat_service/chat");
const DataController = require("./data_service/dataController");
const ResetService = require("./reset_service/reset");

const build = (db) => {
    const router = express.Router();
    const as = new AuthService(db);
    const dc = new DataController(db);
    const rs = new ResetService(db);
    const cs = new ChatService(db);
    const clearSession = clearResources(cs);

    // Auth routes
    router.post("/login", (req, res, next) => as.login(req, res, next));
    router.post("/signup", (req, res, next) => as.signup(req, res, next));
    router.post("/logout", verifyToken, clearSession, (req, res) => as.logout(req, res));

    // Chat
    router.post("/chat", verifyToken, logApi(db), (req, res, next) => cs.handleChat(req, res, next));

    // Reset
    router.post('/forgot-password', rs.forgotPassword);
    router.post('/reset', rs.resetPassword);

    // Data
    router.get("/me", verifyToken, logApi(db), (req, res, next) => dc.getMe(req, res, next));
    router.get("/get-all-users", verifyToken, logApi(db), (req, res, next) => dc.getAllUserData(req, res, next));
    router.get("/api-stats", verifyToken, logApi(db), (req, res, next) => dc.getApiStats(req, res, next));
    router.get("/endpoint-stats", verifyToken, logApi(db), (req, res, next) => dc.getEndpointStats(req, res, next));
    router.put("/update-api-calls", verifyToken, logApi(db), (req, res, next) => dc.updateApiCallsLeft(req, res, next));
    router.put("/update-role", verifyToken, logApi(db), (req, res, next) => dc.updateRole(req, res, next));
    router.delete("/delete-user", verifyToken, logApi(db), (req, res, next) => dc.deleteUser(req, res, next));

    return router;
};

module.exports = { build };