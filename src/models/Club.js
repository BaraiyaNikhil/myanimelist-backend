const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  spoiler: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  spoiler: { type: Boolean, default: false },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [PostSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Club', ClubSchema);
