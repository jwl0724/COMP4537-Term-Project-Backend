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
        console.log("Checking user in database:", email);
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("Database read error:", error);
        throw error;
    }
};


const writeUser = async function (pool, email, hashedPassword) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );
        return result;
    } catch (error) {
        console.error("Database insertion error:", error);
        throw error;
    }
};

module.exports = { connectToDB, readUser, writeUser };