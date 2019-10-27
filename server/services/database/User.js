const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const saltRounds = 10;

const UserSchema = new Schema({
  displayName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.pre('save', function (next) {
  return bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  })
})

module.exports = mongoose.model('User', UserSchema)