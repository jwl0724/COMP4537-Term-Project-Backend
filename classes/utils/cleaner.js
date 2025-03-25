const chat = require("../chat_service/chat");

const clearResources = (req, res, next) => {
    const deleted = chat.sessions.delete(req.cookies.token);
    if (deleted) console.info("A chatbot session has been deleted");
    next();
}

module.exports = { clearResources };