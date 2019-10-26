require('dotenv').config();
const DB = require('../../services/index').database;
const jwt = require('jsonwebtoken');

const auth = {
  login: (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    DB.User.find({ username: username }, (err, doc) => {
      if (err) {
        console.error(err);
        res.send(400).json({
          success: false,
          message: "Authentication failed. Please check the request"
        })
      } else {
        let valid = doc.checkPassword(password);
        if (!valid) {
          res.send(403).json({
            success: false,
            message: "Invalid username or password"
          })
        } else {
          let token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '24h' });

          res.json({
            success: true,
            message: "Authentication successful",
            token: token
          })
        }
      }
    })
  }
}

module.exports = auth;