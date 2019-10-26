const express = require('express');
const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).send("Hello from the /api endpoint!");
})

Router.post('/user', (req, res) => {
  res.status(200).send("Hello");
});

module.exports = Router;