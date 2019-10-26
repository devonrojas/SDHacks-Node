require("dotenv").config();
const PORT = process.env.PORT || 8000;

const express = require("express");
const app = express();
const path = require('path');

const cors = require("cors");
const morgan = require('morgan');
const checkToken = require('./server/helpers').checkToken;

// Routes
const Router = require('./server/routes');

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Endpoints
app.use("/", express.static(path.join(__dirname, 'client', 'dist')));
app.use('/auth', Router.authRouter);
app.use('/api', checkToken, Router.apiRouter);

app.listen(PORT, () => console.log("Listening on port " + PORT + "..."));