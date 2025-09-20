module.exports = function (req, res, next) {
  if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
  next();
};
