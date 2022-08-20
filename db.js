const Mongoose = require('mongoose');
require("dotenv").config();
const dbConnectionStr = process.env.DB_STRING;

const connectDB = async () => {
  Mongoose.connect(dbConnectionStr)
  .then(client => {
    console.log('User Collection Connected')
  });
}

module.exports = connectDB;