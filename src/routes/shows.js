const express = require('express');
const router = express.Router();
const { listShows, getShow, createShow } = require('../controllers/showsController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', listShows);
router.get('/:id', getShow);
router.post('/', auth, isAdmin, createShow);

module.exports = router;
