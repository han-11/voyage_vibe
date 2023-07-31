const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  date: String
});

module.exports = mongoose.model('Destination', DestinationSchema);