const Database = require("./mysql");

class Repository {
    #db;

    constructor() {
        this.#db = new Database();
    }

    async getUser(email) {
        return await this.#db.readUser(email);
    }

    async writeUser(email, hashedPassword, role, apiCallsLeft, userName) {
        return await this.#db.writeUser(email, hashedPassword, role, apiCallsLeft, userName);
    }

    async getAllUsers() {
        return await this.#db.getAllUsers();
    }

    async updateApiCallsLeft(email, newCount) {
        return await this.#db.updateApiCallsLeft(email, newCount);
    }

    async updateRole(email, newRole) {
        return await this.#db.updateRole(email, newRole);
    }

    async getEndpointStats() {
        return await this.#db.getEndpointStats();
    }

    async getApiStats() {
        return await this.#db.getApiStats();
    }

    async logApiCall(method, endpoint, email) {
        return await this.#db.logApiCall(method, endpoint, email);
    }

    async deleteUser(email) {
        return await this.#db.deleteUser(email);
    }
}

module.exports = Repository;