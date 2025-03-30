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

    static productionCorsOption = {
        origin: (origin, callback) => {
            if (!origin || EP.ALLOWED_ORIGINS.prod.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // methods
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
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // methods
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }

    constructor(port) {
        this.#port = port;
        this.#server = express();

        // Create DB connection
        this.#database = new Repository();

        // Middlewares
        const corsOptions = process.env.MODE === "production" ? Server.productionCorsOption : Server.developmentCorsOption;

        this.#server.use(cors(corsOptions));
        this.#server.options("*", cors(corsOptions));

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

    start = async () => {
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

    stop = () => {
        if (this.#httpServer) {
            this.#httpServer.close(() => console.log("Server stopped"));
        }
    }
}

module.exports = Server;