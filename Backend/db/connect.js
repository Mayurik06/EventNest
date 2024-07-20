const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect("mongodb://127.0.0.1:27017/Calendar");
};

module.exports = connectDB;

