const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, (req, res, next) => {
  loanController.createLoan(req, res, next, req.db);
});

router.get('/user/:userName', authMiddleware, (req, res, next) => {
  loanController.getUserLoans(req, res, next, req.db);
});

module.exports = router;