const implementation = require("./mysql"); // Change the import if needing different DB

class Repository {

    #connection;

    constructor() {
        this.#connection = implementation.connectToDB();
        // this.initializeDatabase();
    }

    // async initializeDatabase() {
    //     try {
    //         await this.#connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    //         // Create Users table if it doesn't exist
    //         await this.#connection.execute(`
    //             CREATE TABLE IF NOT EXISTS users (
    //                 id INT AUTO_INCREMENT PRIMARY KEY,
    //                 email VARCHAR(255) UNIQUE NOT NULL,
    //                 password VARCHAR(255) NOT NULL
    //             )
    //         `);
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    async getUser(email) {
        try {
            return await implementation.readUser(this.#connection, email);
        } catch (error) {
            throw error;
        }
    }

    async writeUser(email, hashedPassword) {
        try {
            return await implementation.writeUser(this.#connection, email, hashedPassword);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Repository;