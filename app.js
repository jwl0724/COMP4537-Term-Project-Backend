const Server = require("./classes/server");

const app = new Server(8000);
app.start();