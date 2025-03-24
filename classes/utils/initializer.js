const fakeYouTTS = require("../chat_service/tts_service/fakeYouTTS");
const createChatbot = require("../chat_service/chatbot/geminiAI");

let chatBot = null;

async function init() {
    await fakeYouTTS.init();

    if (!chatBot) {
        chatBot = createChatbot();
        console.log("Chatbot initialized");
    }
}

function getChatBot() {
    if (!chatBot) throw new Error("Chatbot not initialized.");
    return chatBot;
}


module.exports = { init, getChatBot };