const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  synopsis: String,
  genres: [String],
  totalEpisodes: Number,
  poster: String,
  releaseYear: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Show', ShowSchema);
