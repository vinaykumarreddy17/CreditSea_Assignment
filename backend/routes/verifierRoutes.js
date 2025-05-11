const express = require('express');
const router = express.Router();
const verifierController = require('../controllers/verifierController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/loans', authMiddleware, roleMiddleware('verifier'), (req, res, next) => {
  verifierController.getPendingLoans(req, res, next, req.db);
});

router.put('/loans/:id', authMiddleware, roleMiddleware('verifier'), (req, res, next) => {
  verifierController.updateLoanStatus(req, res, next, req.db);
});

module.exports = router;