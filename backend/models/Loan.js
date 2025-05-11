function createLoan(db, loan, callback) {
  const sql = `
    INSERT INTO loans (fullName, amount, tenure, employmentStatus, employmentAddress, reason, status, dateApplied)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    loan.fullName,
    loan.amount,
    loan.tenure,
    loan.employmentStatus,
    loan.employmentAddress,
    loan.reason,
    loan.status || 'PENDING',
    loan.dateApplied || new Date().toISOString()
  ];
  db.run(sql, params, function(err) {
    callback(err, { id: this?.lastID, ...loan });
  });
}

function getUserLoans(db, fullName, callback) {
  db.all('SELECT * FROM loans WHERE fullName = ?', [fullName], callback);
}

function getPendingLoans(db, callback) {
  db.all('SELECT * FROM loans WHERE status = "PENDING"', [], callback);
}

function updateLoanStatus(db, id, status, callback) {
  db.run('UPDATE loans SET status = ? WHERE id = ?', [status, id], function(err) {
    callback(err, { changes: this?.changes });
  });
}

function getDashboardStats(db, callback) {
  const stats = {};
  db.get('SELECT COUNT(*) as total FROM loans', [], (err, row) => {
    if (err) return callback(err);
    stats.total = row.total;
    db.get('SELECT COUNT(*) as pending FROM loans WHERE status = "PENDING"', [], (err, row) => {
      if (err) return callback(err);
      stats.pending = row.pending;
      db.get('SELECT COUNT(*) as approved FROM loans WHERE status = "APPROVED"', [], (err, row) => {
        if (err) return callback(err);
        stats.approved = row.approved;
        db.get('SELECT COUNT(*) as rejected FROM loans WHERE status = "REJECTED"', [], (err, row) => {
          if (err) return callback(err);
          stats.rejected = row.rejected;
          callback(null, stats);
        });
      });
    });
  });
}

module.exports = {
  createLoan,
  getUserLoans,
  getPendingLoans,
  updateLoanStatus,
  getDashboardStats
};