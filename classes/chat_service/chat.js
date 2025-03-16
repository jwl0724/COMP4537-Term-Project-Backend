const createChatbot = require("../chatbot/geminiAI");
const chatBot = createChatbot();
const chat = chatBot.startChat();

const getResponse = async function (req, res) {
    try {
        const userMessage = req.body.message;

        let result = await chat.sendMessage(userMessage);
        const chatbotText = result.response.text();

        console.log(chatbotText);

        // const ttsResponse = await fetch(ep.TTS, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ text: chatbotText, emotion: emotion })
        // });

        // const ttsData = await ttsResponse.json();

        res.json({
            response: chatbotText
            // audio: ttsData.audio
        });

    } catch (error) {
        throw error;
    }
};

exports.getChat = getResponse;