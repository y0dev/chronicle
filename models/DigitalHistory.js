const mongoose = require('mongoose');

const conn = mongoose.createConnection(
  'mongodb://localhost:27017/chronicle',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
);

const { Schema } = mongoose;

const digitalHistory = new Schema({
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

const DigitalHistory = conn.model('DigitalHistory', digitalHistory);

module.exports = DigitalHistory;
