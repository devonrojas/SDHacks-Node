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
  studentId: {
    type: Number,
    required: true
  },
  phone: {
    type: Number
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  salt: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
})

UserSchema.methods.generateSalt = function () {
  return bcrypt.genSalt(saltRounds);
}

UserSchema.methods.hashPassword = function (password) {
  return bcrypt.hash(password, this.salt);
}

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.hash);
}

UserSchema.virtual('password')
  .set(async function (password) {
    this.salt = await this.generateSalt();
    this.hashedPassword = await this.hashPassword(password);
  })

module.exports = mongoose.model('User', UserSchema)