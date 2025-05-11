import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VerifierDashboard.css';

const VerifierDashboard = () => {
  const [stats, setStats] = useState({});
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatsAndLoans = async () => {
      setLoading(true);
      try {
        const statsRes = await axios.get('http://localhost:5000/api/verifier/stats');
        setStats(statsRes.data);
        const loansRes = await axios.get('http://localhost:5000/api/verifier/loans');
        setLoans(loansRes.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndLoans();
  }, []);

  const updateStatus = async (loanId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/verifier/loans/${loanId}`, { status });
      setLoans(loans.map(loan =>
        (loan.id || loan._id) === loanId ? { ...loan, status } : loan
      ));
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div className="verifier-dashboard-root">
      <h2 className="verifier-dashboard-title">Verifier Dashboard</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <div className="verifier-stats-grid">
            <div className="verifier-stat-card">
              <h3>Total Loans</h3>
              <p>{stats.totalLoans}</p>
            </div>
            <div className="verifier-stat-card">
              <h3>Borrowers</h3>
              <p>{stats.totalBorrowers}</p>
            </div>
            <div className="verifier-stat-card">
              <h3>Cash Disbursed</h3>
              <p>₦{stats.cashDisbursed?.toLocaleString()}</p>
            </div>
            <div className="verifier-stat-card">
              <h3>Savings</h3>
              <p>₦{stats.savings?.toLocaleString()}</p>
            </div>
            <div className="verifier-stat-card">
              <h3>Repaid Loans</h3>
              <p>{stats.repaidLoans}</p>
            </div>
            <div className="verifier-stat-card">
              <h3>Cash Received</h3>
              <p>₦{stats.cashReceived?.toLocaleString()}</p>
            </div>
          </div>
          <div className="verifier-loans-table-container">
            <h3>Pending Loan Applications</h3>
            <table className="verifier-loans-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Amount</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id || loan._id}>
                    <td>{loan.fullName}</td>
                    <td>₦{Number(loan.amount).toLocaleString()}</td>
                    <td>
                      {loan.dateApplied
                        ? new Date(loan.dateApplied).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : ''}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        loan.status === 'PENDING' ? 'status-pending' :
                        loan.status === 'APPROVED' ? 'status-approved' :
                        loan.status === 'REJECTED' ? 'status-rejected' : ''
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      {loan.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateStatus(loan.id || loan._id, 'APPROVED')}
                            className="verify-button"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(loan.id || loan._id, 'REJECTED')}
                            className="reject-button"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loans.length === 0 && <div className="no-loans-msg">No pending loan applications found.</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default VerifierDashboard;