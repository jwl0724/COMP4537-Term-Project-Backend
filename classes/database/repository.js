const implementation = require("./mysql"); // Change the import if needing different DB

class Repository {

    #connection;

    constructor() {
        this.#connection = implementation.connectToDB();
    }

    getUser(email) {
        return implementation.readUser(this.#connection, email);
    }

    AddUser(email, hashedPassword) {
        return implementation.writeUser(this.#connection, email, hashedPassword);
    }
}

exports.Repository = Repository;