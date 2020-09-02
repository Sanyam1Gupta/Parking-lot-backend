const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const countriesRoutes = require("./api/routes/countries");
const parkingLotsRoutes = require("./api/routes/parkingLots");
const wheel2TCRoutes = require("./api/routes/wheel2TC");
const wheel4TCRoutes = require("./api/routes/wheel4TC");
const registrationRoutes = require("./api/routes/registration");

mongoose.connect("mongodb+srv://rest-shop:rest-shop@cluster0.msvao.mongodb.net/Sanyam?retryWrites=true&w=majority", {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/countries", countriesRoutes);
app.use("/parkingLots", parkingLotsRoutes);
app.use("/wheel2TC", wheel2TCRoutes);
app.use("/wheel4TC", wheel4TCRoutes);
app.use("/registration", registrationRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
