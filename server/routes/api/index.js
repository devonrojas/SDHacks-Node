const express = require('express');
const Router = express.Router();

const v1 = require('./api.v1');

Router.use("/v1", v1);

module.exports = Router;