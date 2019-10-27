const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShortItemSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  qty: {
    type: String,
    required: true
  }
})

const TransactionSchema = new Schema({
  id: {
    type: String,
    default: mongoose.Types.ObjectId
  },
  studentID: {
    type: String,
    required: true
  },
  items: {
    type: [ShortItemSchema],
    required: true
  },
  vendorID: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Transaction', TransactionSchema);