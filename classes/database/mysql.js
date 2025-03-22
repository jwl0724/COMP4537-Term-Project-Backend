require("dotenv").config();
const mysql = require("mysql2");

const connectToDB = function () {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    return pool.promise();
};

const readUser = async function (pool, email) {
    try {
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

const writeUser = async function (pool, email, hashedPassword, role, apiCallsLeft) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO users (email, password, role, api_calls_left) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, role, apiCallsLeft]
        );
        return result;
    } catch (error) {
        throw error;
    }
};


const getAllUsers = async function (pool) {
    try {
        const [rows] = await pool.execute("SELECT * FROM users");
        return rows;
    } catch (error) {
        throw error;
    }
};

const updateApiCallsLeft = async function (pool, email, newCount) {
    try {
        const [result] = await pool.execute(
            "UPDATE users SET api_calls_left = ? WHERE email = ?",
            [newCount, email]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = { connectToDB, readUser, writeUser, getAllUsers, updateApiCallsLeft };
