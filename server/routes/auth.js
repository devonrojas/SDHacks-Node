const express = require("express");
const Router = express.Router();

const helpers = require('../helpers');

Router.post("/login", helpers.auth.login);

module.exports = Router;