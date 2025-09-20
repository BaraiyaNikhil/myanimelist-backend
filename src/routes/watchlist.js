const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserWatchlist, addToWatchlist, updateWatchlistItem, deleteWatchlistItem } = require('../controllers/watchlistController');

router.get('/', auth, getUserWatchlist);
router.post('/', auth, addToWatchlist);
router.patch('/:id', auth, updateWatchlistItem);
router.delete('/:id', auth, deleteWatchlistItem);

module.exports = router;
