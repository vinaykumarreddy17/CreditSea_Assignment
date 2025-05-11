import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatsAndLoans = async () => {
      setLoading(true);
      try {
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(statsRes.data);
        const loansRes = await axios.get('http://localhost:5000/api/loans/all');
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

  return (
    <div className="admin-dashboard-root">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <h3>Total Loans</h3>
              <p>{stats.totalLoans}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Active Borrowers</h3>
              <p>{stats.activeBorrowers}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Cash Disbursed</h3>
              <p>₦{stats.cashDisbursed?.toLocaleString()}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Cash Received</h3>
              <p>₦{stats.cashReceived?.toLocaleString()}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Savings</h3>
              <p>₦{stats.savings?.toLocaleString()}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Repaid Loans</h3>
              <p>{stats.repaidLoans}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Other Accounts</h3>
              <p>{stats.otherAccounts}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Active Loans</h3>
              <p>{stats.activeLoans}</p>
            </div>
          </div>
          <div className="admin-loans-table-container">
            <h3>All Loan Applications</h3>
            <table className="admin-loans-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Employment Status</th>
                  <th>Reason</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id || loan._id}>
                    <td>{loan.fullName}</td>
                    <td>₦{Number(loan.amount).toLocaleString()}</td>
                    <td>{loan.tenure} months</td>
                    <td>{loan.employmentStatus}</td>
                    <td>{loan.reason}</td>
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
                        'status-rejected'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loans.length === 0 && <div>No loan applications found.</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;