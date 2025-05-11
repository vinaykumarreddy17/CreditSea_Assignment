const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, (req, res, next) => {
  adminController.getDashboardStats(req, res, next, req.db);
});

module.exports = router;