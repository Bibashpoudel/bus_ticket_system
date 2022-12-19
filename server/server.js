/*******************************************************
 *      Server Starts From Here                        *
 *******************************************************/
"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const http = require("http");
const app = require("./app");
const port = process.env.PORT || 4001;
const server = http.createServer(app);

app.set("PORT_NUMBER", port);

//  Start the app on the specific interface (and port).
server.listen(port, () => {
  console.log(
    `MENGEDEGNA TICKET Server started on port ${port} at Date ${new Date()}`
  );
});

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
