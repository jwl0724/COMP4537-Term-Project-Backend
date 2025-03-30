const Database = require("./mysql");

class Repository {
    #db;

    constructor() {
        this.#db = new Database();
    }

    getUser = async (email) => await this.#db.readUser(email);

    writeUser = async (email, hashedPassword, role, apiCallsLeft, userName) => await this.#db.writeUser(email, hashedPassword, role, apiCallsLeft, userName);

    getAllUsers = async () => await this.#db.getAllUsers();

    updateApiCallsLeft = async (email, newCount) => await this.#db.updateApiCallsLeft(email, newCount);

    updateRole = async (email, newRole) => await this.#db.updateRole(email, newRole);

    getEndpointStats = async () => await this.#db.getEndpointStats();

    getApiStats = async () => await this.#db.getApiStats();

    logApiCall = async (method, endpoint, email) => await this.#db.logApiCall(method, endpoint, email);

    deleteUser = async (email) => await this.#db.deleteUser(email);

    updatePassword = async (email, hashedPassword) => await this.#db.updatePassword(email, hashedPassword);
}

module.exports = Repository;