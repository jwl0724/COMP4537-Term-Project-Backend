const implementation = require("./mysql"); // Change the import if needing different DB

class Repository {

    #connection;

    constructor() {
        this.#connection = implementation.connectToDB();
    }

    async getUser(email) {
        try {
            return await implementation.readUser(this.#connection, email);
        } catch (error) {
            throw error;
        }
    }

    async writeUser(email, hashedPassword, role, apiCallsLeft) {
        try {
            return await implementation.writeUser(this.#connection, email, hashedPassword, role, apiCallsLeft);
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            return await implementation.getAllUsers(this.#connection);
        } catch (error) {
            throw error;
        }
    }

    async updateApiCallsLeft(email, newCount) {
        return await implementation.updateApiCallsLeft(this.#connection, email, newCount);
    }
}

module.exports = Repository;