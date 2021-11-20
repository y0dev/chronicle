const mongoose = require('mongoose');

const digitalHistory = new mongoose.Schema({
  name: {
    type: String,
    required: 'No Name Provided',
  },
  linkIds: {
    type: Array,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const DigitalHistory = mongoose.model('DigitalHistory', digitalHistory);

module.exports = DigitalHistory;
