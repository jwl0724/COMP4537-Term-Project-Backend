const fakeYouTTS = require("../chat_service/tts_service/fakeYouTTS");
const chatbot = require("../chat_service/chatbot/geminiAI");

async function init() {
    await fakeYouTTS.init();
    await chatbot.init();
}

module.exports = { init, chatbot };