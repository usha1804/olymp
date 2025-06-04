const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  established: Number
});

module.exports = mongoose.model('School', schoolSchema);
