const cb = require("./chatbot/geminiAI");
const fyTTS = require("./tts_service/fakeYouTTS");

class ChatService {
    #sessions = new Map();

    constructor(database) {
        this.db = database;
    }

    getSession(email) {
        if (!this.#sessions.has(email)) {
            this.#sessions.set(email, new cb());
        }
        return this.#sessions.get(email);
    }

    clearSession(email) {
        return this.#sessions.delete(email);
    }

    async handleChat(req, res, next) {
        try {
            const userEmail = req.user.email;
            const user = await this.db.getUser(userEmail);
            if (!user) throw new Error("User not found");

            const isAtLimit = user.api_calls_left === 0;
            const userMessage = req.body.message;
            if (!userMessage) throw new Error("No message provided in the request body.");

            const chatbot = this.getSession(userEmail);
            const result = await chatbot.sendMessage(userMessage);
            const chatbotText = result.response.text();

            // Extract emotion from the response
            const match = chatbotText.match(/^(happy|sad|angry|disgust|scared|shocked|mock|neutral):\s*(.*)/i);
            const emotion = match ? match[1].toLowerCase() : "neutral";
            const finalText = match ? match[2] : chatbotText;
            console.log(`${emotion}: ${finalText}`);

            const audioUrl = await fyTTS.generateAudioFromText(finalText);

            if (user.api_calls_left !== -1) {
                await this.db.updateApiCallsLeft(userEmail, user.api_calls_left - 1);
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
    }
}

module.exports = ChatService;