require("dotenv").config();
const mysql = require("mysql2");

const connectToDB = function () {
    // Expects to run server with .env file
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }).promise(); // Enables async/await support
    return pool;
};

const readUser = async function (pool, email) {
    try {
        const [rows] = await pool.execute("SELECT * FROM Users WHERE email = ?", [email]);
        return rows.length ? rows[0] : null; 
    } catch (error) {
        console.error("Database read error:", error)
        throw error;
    }
};

const writeUser = async function (pool, email, hashedPassword) {
    try {
        const [result] = await pool.execute("INSERT INTO Users (email, password) VALUES (?, ?)", [email, hashedPassword]);
        return result;
    } catch (error) {
        console.error("Database insertion error: ", error);
        throw error;
    }
};

exports.connectToDB = connectToDB;
exports.readUser = readUser;
exports.writeUser = writeUser;
