const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../../helpers/connectDB');
const AddLink = require('./routes');
const notFound = require('../../middleware/not-found');
const errorHandlerMiddleWare = require('../../middleware/error-handler');
require('dotenv').config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ msg: 'Home Page' });
});

AddLink(app);

app.use(notFound);
app.use(errorHandlerMiddleWare);

const start = async () => {
  try {
    const PORT = process.env.SERVER_PORT ||  8000;
    await connectDB();
    app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

start();

/*
2. Focus on link agrregator applicaiton
*/
