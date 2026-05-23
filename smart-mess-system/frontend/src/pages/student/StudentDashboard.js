// frontend/src/pages/student/StudentDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';

const todayMeals = [
  { type: 'Breakfast', time: '7:30 - 9:30 AM', icon: '🥞', items: ['Idli Sambar', 'Poha', 'Tea/Coffee'], cal: 420, status: 'used' },
  { type: 'Lunch', time: '12:00 - 2:00 PM', icon: '🍛', items: ['Dal Tadka', 'Jeera Rice', 'Roti', 'Sabzi'], cal: 680, status: 'booked' },
  { type: 'Dinner', time: '7:00 - 9:00 PM', icon: '🌙', items: ['Paneer Butter Masala', 'Naan', 'Salad'], cal: 720, status: null },
];

const recentBookings = [
  { date: 'Today', meal: 'Lunch', status: 'booked', id: 'BK-2025-0831' },
  { date: 'Yesterday', meal: 'Dinner', status: 'used', id: 'BK-2025-0830' },
  { date: 'Mon, 28 Aug', meal: 'Breakfast', status: 'used', id: 'BK-2025-0829' },
  { date: 'Sun, 27 Aug', meal: 'Lunch', status: 'cancelled', id: 'BK-2025-0827' },
];

const statusStyle = {
  used: { background: '#dbeafe', color: '#1e3a8a', label: '✓ Used' },
  booked: { background: '#dcfce7', color: '#14532d', label: '● Booked' },
  cancelled: { background: '#fee2e2', color: '#7f1d1d', label: '✕ Cancelled' },
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <MainLayout title="Student Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg,#052e16,#065f46)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', overflow: 'hidden', color: '#fff'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(74,222,128,.07)' }} />
        <div>
          <div style={{ fontSize: 12, color: '#86efac', fontWeight: 500, marginBottom: 4 }}>Good morning 👋</div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p style={{ fontSize: 13, opacity: .7, margin: 0 }}>
            {user?.studentId ? `ID: ${user.studentId} • ` : ''}Today is a great day for a healthy meal.
          </p>
        </div>
        <button onClick={() => navigate('/student/booking')} style={{
          padding: '10px 20px', background: '#16a34a',
          border: 'none', borderRadius: 9, color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif", flexShrink: 0
        }}>+ Book a Meal</button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Meals This Month', value: '24', icon: '🍽️', color: '#16a34a' },
          { label: 'Active Bookings', value: '1', icon: '📅', color: '#059669' },
          { label: 'Avg Calories/Day', value: '1,820', icon: '🔥', color: '#d97706' },
          { label: 'Feedback Given', value: '8', icon: '⭐', color: '#7c3aed' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Today's Meals */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            🍽️ Today's Meals
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayMeals.map((m, i) => (
              <div key={i} style={{
                border: '1px solid #e2e8f0', borderRadius: 10, padding: 12,
                display: 'flex', gap: 12, alignItems: 'flex-start'
              }}>
                <div style={{
                  width: 44, height: 44, background: '#f0fdf4', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
                }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.type}</span>
                    {m.status && (
                      <span style={{ ...statusStyle[m.status], fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                        {statusStyle[m.status].label}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', margin: '2px 0' }}>{m.time}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{m.items.join(' • ')}</div>
                  <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 500, marginTop: 3 }}>🔥 {m.cal} kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600 }}>📋 Recent Bookings</div>
            <button onClick={() => navigate('/student/history')} style={{
              fontSize: 12, color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500
            }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentBookings.map((b, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{b.meal}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{b.date} • {b.id}</div>
                </div>
                <span style={{ ...statusStyle[b.status], fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                  {statusStyle[b.status].label}
                </span>
              </div>
            ))}
          </div>

          {/* Quick QR */}
          <div style={{ marginTop: 14, padding: 14, background: 'linear-gradient(135deg,#052e16,#065f46)', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#86efac', fontWeight: 600, marginBottom: 8 }}>📱 Your Meal QR</div>
            <button onClick={() => navigate('/student/qr')} style={{
              padding: '8px 20px', background: '#16a34a', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>Show QR Code</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
