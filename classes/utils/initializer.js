const fakeYouTTS = require("../chat_service/tts_service/fakeYouTTS");

const init = async () => {
    await fakeYouTTS.init();
};

module.exports = { init };
