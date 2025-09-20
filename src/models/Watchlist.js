const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  status: { type: String, default: 'Plan to Watch' },
  episodesWatched: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 10 },
  notes: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
