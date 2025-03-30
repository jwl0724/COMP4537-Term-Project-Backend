require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { init } = require("./utils/initializer");
const { build } = require("./routeBuilder");
const Repository = require("./database/repository");
const EP = require("../constants/endpoints")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger_ui/swagger");

class Server {
    #port
    #server;
    #database;
    #httpServer;

    static corsOptions = {
        origin: (origin, callback) => {
            console.log("CORS check origin:", origin);
            if (!origin || EP.ALLOWED_ORIGINS.prod.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    };

    constructor(port) {
        this.#port = port;
        this.#server = express();

        // Create DB connection
        this.#database = new Repository();

        // Middlewares
        this.#server.use(cors(Server.corsOptions));
        this.#server.options('*', cors(Server.corsOptions));

        this.#server.use(cookieParser());

        this.#server.use(express.json());

        this.#server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        this.#server.use("/api/v1", build(this.#database));

        this.#server.use((err, req, res, next) => { // IMPORTANT: THIS NEEDS TO BE LAST OF THE MIDDLEWARES
            console.error("Error:", err.message);
            const statusCode = err.status || 500;
            res.status(statusCode).json({ error: err.message });
        });
    }

    async start() {
        try {
            await init();
            this.#httpServer = this.#server.listen(this.#port, () => {
                console.log(`Server started on port ${this.#port}`);
            });
        } catch (err) {
            console.error("Failed to initialize services:", err.message);
            process.exit(1);
        }
    }

    stop() {
        if (this.#httpServer) {
            this.#httpServer.close(() => console.log("Server stopped"));
        }
    }
}

module.exports = Server;