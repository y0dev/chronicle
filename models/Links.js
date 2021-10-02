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

const links = new Schema({
  url: {
    type: String,
    required: 'No URL Provided',
  },
  title: {
    type: String,
    required: 'No title provided',
  },
  description: {
    type: String,
    //required: 'No description provided',
  },
  keywords: {
    type: Array,
  },
  image: {
    type: String,
  },
  alt: {
    type: String,
  },
  owner: {
    type: Number,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const Links = conn.model('Links', links);

module.exports = Links;
