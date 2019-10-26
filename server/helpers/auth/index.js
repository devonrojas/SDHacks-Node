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
        res.status(400).json({
          success: false,
          message: "Authentication failed. Please check the request"
        })
      } else {
        doc = doc[0];
        let user = Object.assign(new DB.User(), doc);
        let valid = user.checkPassword(password);
        if (!valid) {
          res.status(403).json({
            success: false,
            message: "Invalid username or password"
          })
        } else {
          let token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '24h' });

          res.status(200).json({
            success: true,
            message: "Authentication successful",
            token: token
          })
        }
      }
    })
  },
  create: (req, res) => {

    let user = new DB.User({
      username: req.body.username,
      displayName: req.body.displayName,
      password: req.body.password,
      studentId: req.body.studentId,
      email: req.body.email,
      phone: req.body.phone || 123456789
    });

    user.save((err, doc) => {
      console.log("here", doc);
      if (err) {
        console.error(err);
        res.status(400).json({
          success: false,
          message: "Error creating new user"
        })
      } else {
        let token = jwt.sign({ username: doc.username }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
          success: true,
          message: "User created. Authentication successful",
          token: token
        })
      }
    })
  }
}

module.exports = auth;