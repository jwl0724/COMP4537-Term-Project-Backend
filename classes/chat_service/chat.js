const createChatbot = require("../chatbot/geminiAI");
const chatBot = createChatbot();
const chat = chatBot.startChat();

const getResponse = async function (req, res) {
    try {
        const userMessage = req.body.message;

        let result = await chat.sendMessage(userMessage);
        const chatbotText = result.response.text();

        // Extract emotion from the response
        const match = chatbotText.match(/^(happy|sad|angry|disgust|scared|shocked|mock|neutral):\s*(.*)/i);
        const emotion = match ? match[1].toLowerCase() : "neutral";
        const finalText = match ? match[2] : chatbotText;

        console.log(`${emotion}): ${finalText}`);

        // const ttsResponse = await fetch(ep.TTS, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ text: chatbotText, emotion: emotion })
        // });

        // const ttsData = await ttsResponse.json();

        res.json({
            [emotion]: finalText
            // audio: ttsData.audio
        });

    } catch (error) {
        throw error;
    }
};

exports.getChat = getResponse;