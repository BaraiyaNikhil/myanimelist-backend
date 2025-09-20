const Show = require('../models/Show');

const listShows = async (req, res, next) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    next(err);
  }
};

const getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ msg: 'Not found' });
    res.json(show);
  } catch (err) {
    next(err);
  }
};

const createShow = async (req, res, next) => {
  try {
    const { title, synopsis, genres, totalEpisodes, poster, releaseYear } = req.body;
    const show = new Show({ title, synopsis, genres, totalEpisodes, poster, releaseYear });
    await show.save();
    res.json(show);
  } catch (err) {
    next(err);
  }
};

module.exports = { listShows, getShow, createShow };
