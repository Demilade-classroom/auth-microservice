const mongoose = require('mongoose');
const config = require('./index');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

function initializeDB() {
  mongoose
    .connect(config.MONGODBURI, options)
    .then(() => console.log(':: Connected to database'))
    .catch((error) => console.log(":: Couldn't connect to database >>>> ", error));
};

module.exports = initializeDB;