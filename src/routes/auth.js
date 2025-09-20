const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register',
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { username, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      user = new User({ username, email, passwordHash, role: 'user' });
      await user.save();

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

      res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) { next(err); }
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

      res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) { next(err); }
  }
);

module.exports = router;
