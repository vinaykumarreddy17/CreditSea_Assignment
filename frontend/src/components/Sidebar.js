import React from 'react';
import './Sidebar.css';

const linksConfig = {
  user: [
    { label: 'Dashboard', icon: '🏠' },
    { label: 'Borrow Cash', icon: '💸' },
    { label: 'Transactions', icon: '📄' },
    { label: 'Deposit Cash', icon: '🏦' },
    { label: 'Applied Loans', icon: '📝' }
  ],
  admin: [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Loan Parameters', icon: '⚙️' },
    { label: 'User Management', icon: '👥' },
    { label: 'Reports', icon: '📈' },
    { label: 'System Settings', icon: '🔧' }
  ],
  verifier: [
    { label: 'Pending Verifications', icon: '⏳' },
    { label: 'Approval History', icon: '✅' },
    { label: 'Document Templates', icon: '📁' }
  ]
};

const Sidebar = ({ userRole = 'user', userName = 'John Okoh', avatarUrl, activeLink }) => {
  const links = linksConfig[userRole] || linksConfig.user;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-app-title">
        <span role="img" aria-label="logo" style={{ fontSize: 24, marginRight: 8 }}>💳</span>
        <span>CREDIT APP</span>
      </div>
      <div className="sidebar-header">
        <div className="sidebar-avatar">
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" />
            : <span role="img" aria-label="avatar" style={{ fontSize: 32 }}>👤</span>
          }
        </div>
        <div>
          <p className="sidebar-username">{userName}</p>
          <p className="sidebar-role">{userRole.toUpperCase()}</p>
        </div>
      </div>
      <nav className="sidebar-links">
        {links.map(({ label, icon }) => (
          <button
            key={label}
            className={`sidebar-link${activeLink === label ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;