const Loan = require('../models/Loan');

exports.createLoan = (req, res, next, db) => {
  Loan.createLoan(db, req.body, (err, loan) => {
    if (err) {
      console.error("Error creating loan:", err.stack);
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json(loan);
  });
};

exports.getUserLoans = (req, res, next, db) => {
  const { userName } = req.params;

  if (!userName) {
    return res.status(400).json({ message: "User name is required" });
  }

  Loan.getUserLoans(db, userName, (err, loans) => {
    if (err) {
      console.error("Error fetching user loans:", err.stack);
      return res.status(500).json({ message: err.message });
    }
    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No loans found for the specified user" });
    }
    res.json(loans);
  });
};