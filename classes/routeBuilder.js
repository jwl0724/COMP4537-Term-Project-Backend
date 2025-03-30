const express = require("express");
const auth = require("./auth_service/auth");
const reset = require("./reset_service/reset");
const clearResources = require("./utils/cleaner");
const { logApi } = require("./utils/logApi");
const { verifyToken } = require("./utils/token");
const ChatService = require("./chat_service/chat");
const DataController = require("./data_service/dataController");
const { forgotPassword, resetPassword } = require('./reset_service/reset');

const build = (db) => {
    const router = express.Router();
    const dc = new DataController(db);
    const cs = new ChatService(db);
    const clearSession = clearResources(cs);

    // Auth routes
    router.post("/login", (req, res, next) => auth.login(req, res, db, next));
    router.post("/signup", (req, res, next) => auth.signup(req, res, db, next));
    router.post("/logout", verifyToken, clearSession, (req, res) => auth.logout(req, res));

    router.post('/forgot-password', async (req, res, next) => {
        await dc.forgotPassword(req, res, next);
    });

    router.post('/reset', verifyToken, logApi(db), async (req, res, next) => {
        dc.resetPassword(req, res, next); // Call the resetPassword method in DataController
    });

    router.put('/update-password', verifyToken, logApi(db), (req, res, next) => {
        dc.updatePassword(req, res, next);
      });


    // Chat
    router.post("/chat", verifyToken, logApi(db), (req, res, next) => cs.handleChat(req, res, next));

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