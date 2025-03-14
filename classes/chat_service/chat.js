const ep = require("../../constants/endpoints");

// On how to use fetch go here: https://www.npmjs.com/package/node-fetch
const getResponse = async function(req, res) {
    const prompt = req.prompt;

    // Get spongebob chatbot response
    const chatbotResponse = await fetch(ep.Chatbot + `/${prompt}`); // This is going to need to be adjusted based on API req
    const chatbotData = await chatbotResponse.json();

    // Send response text to spongebob TTS
    const ttsResponse = await fetch(ep.TTS); // Again append whatever the TTS need
    const ttsData = await ttsResponse.json();

    // Send data back to client
    res.send(JSON.stringify({
        text: chatbotData.text,
        audio: ttsData.audio
    })); // Above will need to be changed depending on what the EP gives back
}

exports.getChat = getResponse;