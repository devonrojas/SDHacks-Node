const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  id: {
    type: String,
    default: mongoose.Types.ObjectId()
  },
  studentID: {
    type: String,
    required: true
  },
  itemID: {
    type: String,
    required: true
  },
  vendorID: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Transaction', TransactionSchema);