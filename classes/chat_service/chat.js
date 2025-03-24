const { getChatBot } = require("../utils/initializer");
const fyTTS = require("./tts_service/fakeYouTTS")

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

        const chatBot = getChatBot();
        let result = await chatBot.sendMessage(userMessage);
        const chatbotText = result.response.text();

        // Extract emotion from the response
        const match = chatbotText.match(/^(happy|sad|angry|disgust|scared|shocked|mock|neutral):\s*(.*)/i);
        const emotion = match ? match[1].toLowerCase() : "neutral";
        const finalText = match ? match[2] : chatbotText;

        console.log(`${emotion}: ${finalText}`);

        const audioUrl = await fyTTS.generateAudioFromText(finalText);

        if (user.api_calls_left !== -1) {
            await db.updateApiCallsLeft(userEmail, user.api_calls_left - 1);
        }

        res.json({
            text: finalText,
            emotion: emotion,
            alert: isAtLimit,
            audioUrl: audioUrl
        });

    } catch (error) {
        next(error);
    }
};

exports.getChat = getResponse;