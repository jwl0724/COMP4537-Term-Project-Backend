require("dotenv").config();
const fakeYou = require("fakeyou.js");

const fy = new fakeYou.Client({
    usernameOrEmail: "dotbeige",
    password: process.env.PASSWORD,
});

async function searchSpongeBobModels() {
    try {
        // Start the client
        await fy.start();

        // Search for models with 'SpongeBob' in the title
        const searchTerm = "SpongeBob SquarePants (Seasons 1 & 2)";
        const searchedModels = fy.searchModel(searchTerm);
        let result = await fy.makeTTS(searchedModels.first(), 'A cool text to speech');
        result.audioURL();
    } catch (error) {
        console.error("An error occurred:", error);
        return [];
    }
}

module.exports = { searchSpongeBobModels };