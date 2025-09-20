const Watchlist = require('../models/Watchlist');

const getUserWatchlist = async (req, res, next) => {
  try {
    const list = await Watchlist.find({ userId: req.user.id }).populate('showId');
    res.json(list);
  } catch (err) { next(err); }
};

const addToWatchlist = async (req, res, next) => {
  try {
    const { showId, status } = req.body;
    let item = await Watchlist.findOne({ userId: req.user.id, showId });
    if (item) return res.status(400).json({ msg: 'Show already in watchlist' });
    item = new Watchlist({ userId: req.user.id, showId, status });
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

const updateWatchlistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const item = await Watchlist.findById(id);
    if (!item) return res.status(404).json({ msg: 'Not found' });
    if (item.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not allowed' });
    Object.assign(item, updates, { updatedAt: new Date() });
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

const deleteWatchlistItem = async (req, res, next) => {
  try {
    const item = await Watchlist.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Not found' });
    if (item.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not allowed' });
    await item.remove();
    res.json({ msg: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { getUserWatchlist, addToWatchlist, updateWatchlistItem, deleteWatchlistItem };
