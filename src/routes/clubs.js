const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listClubs, createClub, getClub, joinClub, createPost, commentOnPost, deleteClub, deletePost, deleteComment } = require('../controllers/clubsController');

router.get('/', listClubs);
router.get('/:id', getClub);
router.post('/', auth, createClub);
router.post('/:id/join', auth, joinClub);
router.post('/:id/posts', auth, createPost);
router.post('/:id/posts/:postId/comments', auth, commentOnPost);
router.delete('/:id', auth, deleteClub);
router.delete('/:id/posts/:postId', auth, deletePost);
router.delete('/:id/posts/:postId/comments/:commentId', auth, deleteComment);

module.exports = router;
