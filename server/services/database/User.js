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
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.pre('save', function (next) {
  console.log("pre save", this);
  return bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  })
})

// UserSchema.virtual('password')
//   .set(async function (password) {
//     this.salt = await this.generateSalt();
//     this.hashedPassword = await this.hashPassword(password);
//     console.log(this);
//   })
//   .get(() => this.hashedPassword);

module.exports = mongoose.model('User', UserSchema)