const express = require("express");
const cors = require("cors");
const route = require("./routeBuilder");
const Repository = require("./database/repository");

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
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true })); // Probably need to change origin later
        this.#server.use(express.json());

        this.#server.use((err, req, res, next) => { // IMPORTANT: THIS NEEDS TO BE LAST OF THE MIDDLEWARES
            console.error("Error:", err);
            res.status(400).send({ error: err.message });
        });

        route.build(this.#server, this.#database);
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