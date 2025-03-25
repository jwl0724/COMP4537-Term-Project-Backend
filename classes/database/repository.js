const Database = require("./mysql");

class Repository {
    #db;

    constructor() {
        this.#db = new Database();
    }

    async getUser(email) {
        return await this.#db.readUser(email);
    }

    async writeUser(email, hashedPassword, role, apiCallsLeft) {
        return await this.#db.writeUser(email, hashedPassword, role, apiCallsLeft);
    }

    async getAllUsers() {
        return await this.#db.getAllUsers();
    }

    async updateApiCallsLeft(email, newCount) {
        return await this.#db.updateApiCallsLeft(email, newCount);
    }

    async getEndpointStats() {
        return await this.#db.getEndpointStats();
    }

    async getUserApiStats() {
        return await this.#db.getUserApiStats();
    }

    async logApiCall(method, endpoint, email) {
        return await this.#db.logApiCall(method, endpoint, email);
    }
}

module.exports = Repository;