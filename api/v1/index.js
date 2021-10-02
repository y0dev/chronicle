const express = require('express');
const bodyParser = require('body-parser');
const AddLink = require('./links');

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

app.listen(8000, () => {
  console.log('running on 8000');
});

/*
2. Focus on link agrregator applicaiton
*/
