require("dotenv").config();
const PORT = process.env.PORT || 8000;

const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require('morgan');
const checkToken = require('./server/helpers').checkToken;

// Routes
const Router = require('./server/routes');

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Endpoints
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Carbon!");
})
app.use('/auth', Router.authRouter);
app.use('/api', checkToken, Router.apiRouter);

app.listen(PORT, () => console.log("Listening on port " + PORT + "..."));