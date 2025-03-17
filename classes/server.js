const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./routeBuilder");
const Repository = require("./database/repository");
const EP = require("../constants/endpoints")

class Server {
    #port
    #server;
    #database;
    #httpServer;

    constructor(port) {
        this.#port = port;
        this.#server = express();

        // Create DB connection
        this.#database = new Repository();

        // Middlewares
        this.#server.use(cors({
            origin: `http://${EP.FE}`,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        })); // Probably need to change origin later

        this.#server.use(cookieParser());

        this.#server.use(express.json());

        route.build(this.#server, this.#database);

        this.#server.use((err, req, res, next) => { // IMPORTANT: THIS NEEDS TO BE LAST OF THE MIDDLEWARES
            console.error("Error:", err);
            const statusCode = err.status || 500;
            res.status(statusCode).json({ error: err.message });
        });
    }

    start() {
        this.#httpServer = this.#server.listen(this.#port, () => {
            console.log(`Server started on port ${this.#port}`);
        });
    }

    stop() {
        if (this.#httpServer) {
            this.#httpServer.close(() => console.log("Server stopped"));
        }
    }
}

module.exports = Server; 