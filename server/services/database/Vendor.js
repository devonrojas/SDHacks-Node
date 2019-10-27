const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  id: {
    type: String,
    default: mongoose.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Vendor', VendorSchema);