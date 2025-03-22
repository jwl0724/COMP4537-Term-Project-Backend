const createChatbot = require("./chatbot/geminiAI");

const getResponse = async function (req, res, db, next) {
    try {
        const userEmail = req.user.email;
        const user = await db.getUser(userEmail);

        if (!user) throw new Error("User not found");

        const isAtLimit = user.api_calls_left === 0;

        const userMessage = req.body.message;

        if (!userMessage) {
            throw new Error("No message provided in the request body.");
        }

        const chatBot = createChatbot();
        let result = await chatBot.sendMessage(userMessage);
        const chatbotText = result.response.text();

        // Extract emotion from the response
        const match = chatbotText.match(/^(happy|sad|angry|disgust|scared|shocked|mock|neutral):\s*(.*)/i);
        const emotion = match ? match[1].toLowerCase() : "neutral";
        const finalText = match ? match[2] : chatbotText;

        console.log(`${emotion}: ${finalText}`);

        // const ttsResponse = await fetch(ep.TTS, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ text: chatbotText, emotion: emotion })
        // });

        // const ttsData = await ttsResponse.json();

        if (user.api_calls_left !== -1) {
            await db.updateApiCallsLeft(userEmail, user.api_calls_left - 1);
        }

        res.json({
            text: finalText,
            emotion: emotion,
            alert: isAtLimit,
            // audio: ttsData.audio
        });

    } catch (error) {
        next(error);
    }
};

exports.getChat = getResponse;