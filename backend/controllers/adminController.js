const Loan = require('../models/Loan');

exports.getDashboardStats = (req, res, next, db) => {
  Loan.getDashboardStats(db, (err, stats) => {
    if (err) {
      console.error("Error fetching dashboard stats:", err.stack);
      return res.status(500).json({ message: err.message });
    }
    res.json({
      totalLoans: stats.total || 0,
      totalBorrowers: stats.totalBorrowers || 0,
      cashDisbursed: stats.cashDisbursed || 0,
      cashReceived: stats.cashReceived || 0,
      activeLoans: stats.activeLoans || 0,
      repaidLoans: stats.repaidLoans || 0
    });
  });
};