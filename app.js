const Server = require("./classes/server");

const app = new Server(8080);
app.start();