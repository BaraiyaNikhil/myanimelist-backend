const Club = require('../models/Club');

const createClub = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const club = new Club({ name, description, members: [req.user.id] });
    await club.save();
    res.json(club);
  } catch (err) { next(err); }
};

const listClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find().limit(100).select('-posts');
    res.json(clubs);
  } catch (err) { next(err); }
};

const getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate('members', 'username email').lean();
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    res.json(club);
  } catch (err) { next(err); }
};

const joinClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    if (!club.members.includes(req.user.id)) {
      club.members.push(req.user.id);
      await club.save();
    }
    res.json(club);
  } catch (err) { next(err); }
};

const createPost = async (req, res, next) => {
  try {
    const { title, body, spoiler } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    const post = { author: req.user.id, title, body, spoiler: !!spoiler, comments: [] };
    club.posts.unshift(post);
    await club.save();
    res.json(club.posts[0]);
  } catch (err) { next(err); }
};

const commentOnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, spoiler } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    const post = club.posts.id(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const comment = { author: req.user.id, content, spoiler: !!spoiler };
    post.comments.push(comment);
    await club.save();
    res.json(comment);
  } catch (err) { next(err); }
};

const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    
    // Check if the first member (creator) is the current user
    if (club.members[0].toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this club' });
    }
    
    await club.deleteOne();
    res.json({ msg: 'Club deleted successfully' });
  } catch (err) { next(err); }
};

const deletePost = async (req, res, next) => {
  try {
    const { id, postId } = req.params;
    const club = await Club.findById(id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    
    const post = club.posts.id(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    
    // Check if post author is the current user
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this post' });
    }
    
    post.deleteOne();
    await club.save();
    res.json({ msg: 'Post deleted successfully' });
  } catch (err) { next(err); }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id, postId, commentId } = req.params;
    const club = await Club.findById(id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    
    const post = club.posts.id(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    
    // Check if comment author is the current user
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }
    
    comment.deleteOne();
    await club.save();
    res.json({ msg: 'Comment deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { 
  createClub, 
  listClubs, 
  getClub, 
  joinClub, 
  createPost, 
  commentOnPost,
  deleteClub,
  deletePost,
  deleteComment
};
