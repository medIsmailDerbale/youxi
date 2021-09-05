const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 8000;

// uncaught errors
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaught EXCEPTION shutting down");
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successfull");
  });

const server = app.listen(port, () => {
  console.log(`running on port ${port}...`);
});

// uncaught errors
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message.split("\n")[0]);
  console.log("unhandled rejection shutting down");
  server.close(() => process.exit(1));
});
