const express = require("express");
const cors = require("cors");
const route = require("./routeBuilder");
const repo = require("./database/repository");

class Server {

    #port
    #server;
    #database;

    constructor(port) {
        this.#port = port;
        this.#server = express();

        // Create DB connection
        this.#database = new repo.Repository();

        // Middlewares
        this.#server.use(cors({ origin: "*" })) // Probably need to change origin later
        this.#server.use((err, req, res, next) => res.sendStatus(400).send(err)); // IMPORTANT: THIS NEEDS TO BE LAST OF THE MIDDLEWARES

        route.build(this.#server, this.#database);
    }

    start() {
        this.#server.listen(this.#port, () => {
            console.log(`Server started on port ${this.#port}`);
        });
    }

    stop() {
        this.#server.close();
    }
}

exports.Server = Server;