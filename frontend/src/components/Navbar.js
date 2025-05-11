import React from 'react';
import './Navbar.css';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'admin', label: 'Admin' }
];

const Navbar = ({ userRole, setUserRole }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <span className="navbar-logo">CREDIT APP</span>
            <div className="navbar-links">
              <button className="navbar-link">Home</button>
              <button className="navbar-link">Payments</button>
              <button className="navbar-link">Budget</button>
              <button className="navbar-link">Card</button>
            </div>
          </div>
          <div className="navbar-center">
            <div className="role-scrollbar">
              {roles.map((role) => (
                <button
                  key={role.value}
                  className={`role-scroll-btn${userRole === role.value ? ' active' : ''}`}
                  onClick={() => setUserRole(role.value)}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
          <div className="navbar-right">
            <div className="navbar-icons">
              <button className="navbar-icon" title="Notifications">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="navbar-profile">
                <button className="profile-button">
                  <div className="profile-avatar"></div>
                  <span className="profile-arrow">▼</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;