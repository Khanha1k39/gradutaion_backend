const express = require("express")
const morgan = require("morgan")
// const compression = require("compression")
const helmet    = require("helmet");
const compression = require("compression");

const app = express();

//init middle ware

app.use(morgan("dev"))
app.use(helmet());
// app.use(compression());
app.use(compression());
//init db
require('./dbs/init.mongodb')

//handling error


module.exports = app;