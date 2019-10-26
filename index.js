require("dotenv").config();
const PORT = process.env.PORT || 8000;

const express = require("express");
const app = express();
const path = require('path');

const cors = require("cors");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const checkToken = require('./server/helpers').checkToken;

// Routes
const server = require('./server/routes/graphql');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Endpoints
server.applyMiddleware({ app });

app.listen(PORT, () => console.log("Server ready at " + server.graphqlPath));