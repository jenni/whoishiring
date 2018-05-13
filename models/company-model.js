const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  name: String,
  data: [{
    value: Number,
    date: {
      type: Date,
      default: new Date()
    }
  }]
});
 
module.exports = mongoose.model('Company', companySchema);