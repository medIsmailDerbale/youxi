const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaught EXCEPTION shutting down");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
