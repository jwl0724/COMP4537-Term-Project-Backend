const fakeYouTTS = require("../chat_service/tts_service/fakeYouTTS");

async function init() {
    await fakeYouTTS.init();
}

module.exports = { init };