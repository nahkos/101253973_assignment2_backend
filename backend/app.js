const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const morgan = require("morgan");


const employeeRoutes = require("./api/routes/employees");

const DB_URL = "mongodb+srv://nahkosmurp:LevelMoi@comp3123.srhum.mongodb.net/101253973_assignment2?retryWrites=true&w=majority"

mongoose.connect(DB_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected to the database mongoDB Atlas Server");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use("/", employeeRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;