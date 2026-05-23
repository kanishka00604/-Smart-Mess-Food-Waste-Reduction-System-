// frontend/src/layouts/MainLayout.js
// Wraps all dashboard pages — adds sidebar + topbar

import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children, title }) => {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0fdf4' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #bbf7d0',
          padding: '0 24px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
            {title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#475569' }}>{dateStr}</span>
            <div style={{
              padding: '4px 12px', background: '#dcfce7', borderRadius: 20,
              fontSize: 11, fontWeight: 600, color: '#14532d'
            }}>
              {user?.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
            </div>
          </div>
        </div>
        {/* Page Content */}
        <div style={{ padding: '24px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
