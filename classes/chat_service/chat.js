const ep = require("../../constants/endpoints");

// On how to use fetch go here: https://www.npmjs.com/package/node-fetch
const getResponse = async function (req, res) {
    try {
        const fetch = (await import("node-fetch")).default;
        const userMessage = req.body.message;

        const chatbotResponse = await fetch(ep.Chatbot, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        if (!chatbotResponse.ok) {
            throw new Error(`Chatbot API error: ${chatbotResponse.statusText}`);
        }

        const chatbotData = await chatbotResponse.json();

        const emotion = Object.keys(chatbotData)[0] || "neutral";
        const chatbotText = chatbotData[emotion] || "Oops! No response from SpongeBob.";

        console.log(`🤖 Chatbot (${emotion}): ${chatbotText}`);

        // const ttsResponse = await fetch(ep.TTS, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ text: chatbotText, emotion: emotion })
        // });

        // const ttsData = await ttsResponse.json();

        res.json({
            [emotion]: chatbotText
            // audio: ttsData.audio
        });

    } catch (error) {
        throw error;
    }
};

exports.getChat = getResponse;