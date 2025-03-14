const mysql = require("mysql");

const connectToDB = function() {
    // Expects to run server with .env file
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    connection.connect();
    return connection;
}

const readUser = async function(connection, email) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM Users WHERE email = ${email}`, (err, result) => {
            if (err) rej(err);
            res(result);
        });
    })
}

const writeUser = async function(connection, email, hashedPassword) {
    return new Promise((res, rej) => {
        connection.query(`INSERT INTO Users (email, password) VALUES ('${email}', '${hashedPassword}')`, (err, result) => {
            if (err) rej(err);
            res(result);
        });
    });
}

exports.connectToDB = connectToDB;
exports.readUser = readUser;
exports.writeUser = writeUser;