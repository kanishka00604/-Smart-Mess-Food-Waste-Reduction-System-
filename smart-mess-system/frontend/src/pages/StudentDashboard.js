// frontend/src/pages/StudentDashboard.js
// Placeholder — full dashboard will be built in next module

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 40,
        boxShadow: '0 4px 24px rgba(22,163,74,0.1)',
        border: '1px solid #bbf7d0', textAlign: 'center', maxWidth: 420, width: '100%'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#052e16' }}>
          Student Dashboard
        </h1>
        <p style={{ color: '#475569', fontSize: 14, marginTop: 6 }}>
          Welcome back, <strong>{user?.name}</strong>!
        </p>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
          Role: <span style={{ color: '#16a34a', fontWeight: 600 }}>{user?.role}</span>
        </p>
        <div style={{ marginTop: 24, padding: '12px 16px', background: '#dcfce7', borderRadius: 8, fontSize: 13, color: '#14532d' }}>
          ✅ Authentication working! Full dashboard coming in Module 2.
        </div>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 20, padding: '10px 24px',
            background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: 8, color: '#dc2626', fontSize: 13,
            fontWeight: 500, cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
