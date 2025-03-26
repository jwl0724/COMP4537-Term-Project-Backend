const clearSession = (chatService) => {
    return (req, res, next) => {
        if (req.user?.email) {
            const deleted = chatService.clearSession(req.user.email);
            if (deleted) console.info("Chatbot session deleted");
        }
        next();
    };
};

module.exports = clearSession;