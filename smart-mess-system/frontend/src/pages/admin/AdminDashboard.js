// frontend/src/pages/admin/AdminDashboard.js — MODULE 3 (real API)
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { bookingAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const pieColors = ['#16a34a', '#059669', '#0d9488'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingAPI.adminStats(),
      bookingAPI.adminAll({ limit: 5 }),
    ]).then(([statsRes, bookingsRes]) => {
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const weekChart = stats?.weeklyRaw?.map(d => ({
    day: days[d._id - 1] || d._id, bookings: d.count
  })) || [];

  const statusStyle = {
    used:      { background: '#dbeafe', color: '#1e3a8a' },
    booked:    { background: '#dcfce7', color: '#14532d' },
    cancelled: { background: '#fee2e2', color: '#7f1d1d' },
    pending:   { background: '#fef3c7', color: '#92400e' },
  };

  if (loading) return (
    <MainLayout title="Admin Dashboard">
      <div style={{ textAlign: 'center', padding: 80, color: '#475569' }}>Loading dashboard...</div>
    </MainLayout>
  );

  return (
    <MainLayout title="Admin Dashboard">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: "Today's Bookings", value: stats?.todayTotal ?? '—', icon: '📋', color: '#16a34a' },
          { label: 'Meals Served', value: stats?.todayUsed ?? '—', icon: '🍽️', color: '#059669' },
          { label: 'Cancelled Today', value: stats?.todayCancelled ?? '—', icon: '✕', color: '#ef4444' },
          { label: 'Total Students', value: stats?.totalStudents ?? '—', icon: '🎓', color: '#7c3aed' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: 14, top: 14, width: 36, height: 36, background: s.color + '20', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#475569', textTransform: 'uppercase', letterSpacing: .5 }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, margin: '8px 0 4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Bar Chart */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>📊 Weekly Bookings</div>
          {weekChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekChart}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#16a34a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
              No booking data yet. Students need to start booking meals.
            </div>
          )}
        </div>

        {/* AI Prediction card */}
        <div style={{ background: 'linear-gradient(135deg,#052e16,#065f46)', color: '#fff', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#86efac', fontWeight: 600, marginBottom: 8 }}>🤖 AI PREDICTION</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 42, fontWeight: 700 }}>
            {stats?.todayTotal ? Math.round(stats.todayTotal * 0.97) : '—'}
          </div>
          <div style={{ fontSize: 12, opacity: .7, marginBottom: 12 }}>Expected tomorrow</div>
          <div style={{ fontSize: 11, opacity: .6 }}>Based on today's booking trend</div>
          <a href="/admin/ai" style={{ display: 'inline-block', marginTop: 12, padding: '6px 14px', background: 'rgba(74,222,128,.2)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 20, fontSize: 11, color: '#86efac', textDecoration: 'none' }}>
            Run full AI model →
          </a>
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>📋 Recent Bookings</div>
        {recentBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8', fontSize: 13 }}>
            No bookings yet. Students need to sign up and book meals.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Student', 'Meal', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '7px 12px', fontSize: 11, color: '#475569', textTransform: 'uppercase', background: '#f0fdf4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{b.studentId?.name || 'N/A'}</td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{b.mealType}</td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ ...statusStyle[b.status], padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
