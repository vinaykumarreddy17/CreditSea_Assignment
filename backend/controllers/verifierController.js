const Loan = require('../models/Loan');

exports.updateLoanStatus = (req, res, next, db) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'VERIFIED'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  Loan.updateLoanStatus(db, id, status, (err, result) => {
    if (err) {
      console.error("Error updating loan status:", err.stack);
      return res.status(400).json({ message: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.json({ id, status });
  });
};

exports.getPendingLoans = (req, res, next, db) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.all('SELECT * FROM loans WHERE status = "PENDING" LIMIT ? OFFSET ?', [limit, offset], (err, loans) => {
    if (err) {
      console.error("Error fetching pending loans:", err.stack);
      return res.status(500).json({ message: err.message });
    }
    db.get('SELECT COUNT(*) as total FROM loans WHERE status = "PENDING"', [], (err, row) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json({
        total: row.total,
        page,
        limit,
        loans,
      });
    });
  });
};