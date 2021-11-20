const mongoose = require('mongoose');

const localDB = 'mongodb://localhost:27017/chronicle';

const connectDB = (url) => {
   return mongoose.connect(url || localDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   });
}

module.exports = connectDB;