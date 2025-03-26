require("dotenv").config();
const mysql = require("mysql2");

class MySQL {
    #pool;

    constructor() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        }).promise();
    }

    async readUser(email) {
        const [rows] = await this.#pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows.length ? rows[0] : null;
    }

    async writeUser(email, hashedPassword, role, apiCallsLeft) {
        const [rows] = await this.#pool.execute(
            "INSERT INTO users (email, password, role, api_calls_left) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, role, apiCallsLeft]
        );
        return rows;
    }

    async getAllUsers() {
        const [rows] = await this.#pool.execute("SELECT * FROM users");
        return rows;
    }

    async updateApiCallsLeft(email, newCount) {
        const [rows] = await this.#pool.execute(
            "UPDATE users SET api_calls_left = ? WHERE email = ?",
            [newCount, email]
        );
        return rows;
    }

    async updateRole(email, newRole) {
        const [rows] = await this.#pool.execute(
            "UPDATE users SET role = ? WHERE email = ?",
            [newRole, email]
        );
        return rows;
    }

    async getEndpointStats() {
        const [rows] = await this.#pool.execute(`
            SELECT method, endpoint, COUNT(*) AS requests
            FROM api_calls
            GROUP BY method, endpoint
            ORDER BY requests DESC
        `);
        return rows;
    }

    async getApiStats() {
        const [rows] = await this.#pool.execute(`
            SELECT email, method, COUNT(*) AS requests
            FROM api_calls
            GROUP BY email, method
            ORDER BY email
        `);
        return rows;
    }

    async logApiCall(method, endpoint, email) {
        await this.#pool.execute(
            "INSERT INTO api_calls (email, method, endpoint) VALUES (?, ?, ?)",
            [email, method, endpoint]
        );
    }

    async deleteUser(email) {
        const [rows] = await this.#pool.execute(
            "DELETE FROM users WHERE email = ?",
            [email]
        );
        return rows;
    }

    // Create password reset token for the user
    async storePasswordResetToken(email, token, expirationTime) {
        const [rows] = await this.#pool.execute(
            "INSERT INTO password_reset_tokens (email, token, expiration_time) VALUES (?, ?, ?)",
            [email, token, expirationTime]
        );
        return rows;
    }

    // Retrieve password reset token data by token
    async getPasswordResetToken(token) {
        const [rows] = await this.#pool.execute(
            "SELECT * FROM password_reset_tokens WHERE token = ?",
            [token]
        );
        return rows.length ? rows[0] : null;
    }
}

module.exports = MySQL;