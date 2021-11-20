const mongoose = require('mongoose');


const links = new mongoose.Schema({
  url: {
    type: String,
    required: 'No URL Provided',
  },
  title: {
    type: String,
    required: 'No title provided',
    maxlength: [40, 'Title is too long']
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

const Links = mongoose.model('Links', links);

module.exports = Links;
