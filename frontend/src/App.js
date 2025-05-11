import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const VerifierDashboard = lazy(() => import('./components/VerifierDashboard'));

const App = () => {
  const [userRole, setUserRole] = useState('user');
  const [userName] = useState('John Okoh');

  return (
    <Router>
      <div className="app-root">
        <Navbar userRole={userRole} setUserRole={setUserRole} />
        <div className="main-layout">
          <Sidebar userRole={userRole} userName={userName} />
          <div className="dashboard-content">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route
                  path="/"
                  element={
                    userRole === 'admin' ? (
                      <AdminDashboard />
                    ) : userRole === 'verifier' ? (
                      <VerifierDashboard />
                    ) : (
                      <UserDashboard userName={userName} />
                    )
                  }
                />
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;