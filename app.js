const server = require("./classes/server");

const app = new server.Server(8000);
app.start();