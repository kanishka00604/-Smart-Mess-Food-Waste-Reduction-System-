import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { section: 'Overview' },
  { label: 'Dashboard',     path: '/admin/dashboard', icon: '📊' },
  { section: 'Menu & Orders' },
  { label: 'Menu Manager',  path: '/admin/menu',      icon: '🍽️' },
  { label: 'All Bookings',  path: '/admin/bookings',  icon: '📋' },
  { section: 'Insights' },
  { label: 'Waste Tracker', path: '/admin/waste',     icon: '♻️' },
  { label: 'Analytics',     path: '/admin/analytics', icon: '📈' },
  { label: 'AI Prediction', path: '/admin/ai',        icon: '🤖' },
  { label: 'Feedback',      path: '/admin/feedback',  icon: '💬' },
];

const studentNav = [
  { section: 'My Mess' },
  { label: 'Dashboard',     path: '/student/dashboard', icon: '🏠' },
  { label: "Today's Menu",  path: '/student/menu',      icon: '🍽️' },
  { label: 'Order a Meal',  path: '/student/booking',   icon: '🛒' },
  { section: 'My Account' },
  { label: 'My Bookings',   path: '/student/history',   icon: '📋' },
  { label: 'My QR Code',    path: '/student/qr',        icon: '📱' },
  { label: 'Give Feedback', path: '/student/feedback',  icon: '💬' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = user?.role === 'admin' ? adminNav : studentNav;
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{
      width: 220, background: 'linear-gradient(180deg,#052e16 0%,#14532d 100%)',
      color: '#fff', display: 'flex', flexDirection: 'column',
      position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100,
    }}>
      <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#16a34a,#059669)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍱</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: '#86efac' }}>SmartMess</div>
            <div style={{ fontSize: 10, color: '#4ade80', opacity: .7 }}>Food Waste Reduction</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {nav.map((item, i) => {
          if (item.section) return (
            <div key={i} style={{ fontSize: 10, color: '#4ade80', opacity: .5, textTransform: 'uppercase', letterSpacing: 1, padding: '10px 8px 4px', marginTop: i > 0 ? 4 : 0 }}>
              {item.section}
            </div>
          );
          const active = location.pathname === item.path;
          return (
            <div key={i} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, cursor: 'pointer', fontSize: 13, marginBottom: 2,
              background: active ? 'rgba(74,222,128,.2)' : 'transparent',
              color: active ? '#86efac' : 'rgba(255,255,255,.7)',
              fontWeight: active ? 600 : 400,
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />}
            </div>
          );
        })}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: '#4ade80', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', padding: '7px', background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.3)', borderRadius: 7, color: '#fca5a5', fontSize: 12, cursor: 'pointer' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;