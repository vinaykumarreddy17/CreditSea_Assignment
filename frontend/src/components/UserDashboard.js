import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const LoanForm = ({ userName, onLoanSubmitted }) => {
  const [form, setForm] = useState({
    fullName: userName || '',
    amount: '',
    tenure: '',
    employmentStatus: '',
    employmentAddress: '',
    reason: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/loans', form);
      setMessage('Loan application submitted!');
      setForm({ ...form, amount: '', tenure: '', employmentStatus: '', employmentAddress: '', reason: '' });
      if (onLoanSubmitted) onLoanSubmitted();
    } catch (err) {
      setMessage('Failed to submit loan application.');
    }
  };

  return (
    <form className="loan-form" onSubmit={handleSubmit}>
      <h3>Apply for a Loan</h3>
      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" required />
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required type="number" />
      <input name="tenure" value={form.tenure} onChange={handleChange} placeholder="Tenure (months)" required type="number" />
      <input name="employmentStatus" value={form.employmentStatus} onChange={handleChange} placeholder="Employment status" required />
      <input name="employmentAddress" value={form.employmentAddress} onChange={handleChange} placeholder="Employment address" required />
      <input name="reason" value={form.reason} onChange={handleChange} placeholder="Reason for loan" required />
      <label style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
        <input type="checkbox" required /> I have read the important information and accept that by completing the application, I will be bound by the terms
      </label>
      <div style={{ fontSize: '11px', margin: '8px 0' }}>
        Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies
      </div>
      <button type="submit">Submit</button>
      {message && <div style={{ marginTop: 10 }}>{message}</div>}
    </form>
  );
};

const UserDashboard = ({ userName }) => {
  const [loans, setLoans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!userName) {
        setError('User name is not provided.');
        setLoans([]);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/user/${userName}`);
        setLoans(response.data);
        setError('');
      } catch (err) {
        setError(
          err.response && err.response.status === 404
            ? 'No loans found for this user.'
            : 'Failed to fetch loans.'
        );
        setLoans([]);
      }
    };
    fetchLoans();
  }, [userName, refresh]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLoans = loans.slice(indexOfFirst, indexOfLast);

  return (
    <div className="user-dashboard-root">
      <h2 className="user-dashboard-title">User Dashboard</h2>
      <div className="user-dashboard-content">
        <LoanForm userName={userName} onLoanSubmitted={() => setRefresh(r => !r)} />
        <div className="user-dashboard-table-section">
          <div className="user-dashboard-header">
            <h3>Your Loan Applications & Status</h3>
            <div className="user-dashboard-pagination">
              <span>Rows per page: {rowsPerPage}</span>
              <span>{indexOfFirst + 1}-{Math.min(indexOfLast, loans.length)} of {loans.length}</span>
            </div>
          </div>
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
          )}
          <div className="user-dashboard-table-container">
            <table className="user-dashboard-table">
              <thead>
                <tr>
                  <th>Loan Officer</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Employment Status</th>
                  <th>Employment Address</th>
                  <th>Reason</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLoans.map(loan => (
                  <tr key={loan.id || loan._id}>
                    <td>John Oloth</td>
                    <td>₦{Number(loan.amount).toLocaleString()}</td>
                    <td>{loan.tenure} months</td>
                    <td>{loan.employmentStatus}</td>
                    <td>{loan.employmentAddress}</td>
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
                    <td>
                      {loan.status === 'PENDING' && (
                        <button className="cancel-button">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loans.length === 0 && <div className="no-loans-msg">No loan applications found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;