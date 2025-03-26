const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation"
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token"
                }
            }
        },
        security: [{ cookieAuth: [] }]
    },
    apis: ["./classes/swagger_ui/swaggerDocs.js"]
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;