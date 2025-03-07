const express = require("express");
const morgan = require("morgan");
// const compression = require("compression")
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const app = express();

//init middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());
// app.use(compression());
app.use(compression());
//init db
require("./dbs/init.mongodb");

//initrouter
app.use(require("./routes/index"));
//handling error

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
