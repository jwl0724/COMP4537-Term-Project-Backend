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

    static productionCorsOption = {
        origin: (origin, callback) => {
            if (EP.ALLOWED_ORIGINS.prod.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],  // methods
        credentials: true, // Required for cookies
        allowedHeaders: ["Content-Type", "Authorization"]
    }

    static developmentCorsOption = {
        origin: (origin, callback) => {
            if (!origin || /^(http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?)$/.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"), false);
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],  // methods
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }

    constructor(port) {
        this.#port = port;
        this.#server = express();

        // Create DB connection
        this.#database = new Repository();

        // Middlewares
        if (process.env.MODE === "production") this.#server.use(cors(Server.productionCorsOption));
        else this.#server.use(cors(Server.developmentCorsOption));

        this.#server.use(cookieParser());

        this.#server.use(express.json());

        route.build(this.#server, this.#database);

        this.#server.use((err, req, res, next) => { // IMPORTANT: THIS NEEDS TO BE LAST OF THE MIDDLEWARES
            console.error("Error:", err.message);
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