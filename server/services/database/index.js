const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const DB = mongoose.connection;
DB.on('error', console.error.bind(console, 'connection error:'));
DB.once('open', () => console.log("Connected to database."));

const User = require("./User");
const Item = require("./Item");
const Transaction = require('./Transaction');
const Vendor = require("./Vendor")

module.exports = { User, Item, Transaction, Vendor };