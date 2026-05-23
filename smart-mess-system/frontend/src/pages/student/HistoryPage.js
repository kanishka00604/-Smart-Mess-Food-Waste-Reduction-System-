// frontend/src/pages/student/HistoryPage.js
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { bookingAPI } from '../../services/api';

const S = {
  booked:    { bg: '#dcfce7', color: '#14532d', label: '● Booked'    },
  used:      { bg: '#dbeafe', color: '#1e3a8a', label: '✓ Used'      },
  cancelled: { bg: '#fee2e2', color: '#7f1d1d', label: '✕ Cancelled' },
};

const prettyDate = (ymd) => {
  if (!ymd) return '—';
  const [y,m,d] = ymd.split('-').map(Number);
  return new Date(y,m-1,d).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
};

const HistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await bookingAPI.getMy(); setBookings(r.data.bookings); }
    catch { setBookings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      setMsg('✅ Booking cancelled');
      setTimeout(() => setMsg(''), 3000);
      load();
    } catch (err) {
      setMsg('⚠️ ' + (err.response?.data?.message || 'Failed to cancel'));
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const filtered  = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const counts    = {
    all:       bookings.length,
    booked:    bookings.filter(b => b.status === 'booked').length,
    used:      bookings.filter(b => b.status === 'used').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <MainLayout title="My Bookings">
      {msg && <div style={{ background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2', borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: msg.startsWith('✅') ? '#14532d' : '#dc2626', border: `1px solid ${msg.startsWith('✅') ? '#86efac' : '#fca5a5'}` }}>{msg}</div>}

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { key:'all',       label:'Total',      icon:'📋' },
          { key:'booked',    label:'Active',     icon:'🟢' },
          { key:'used',      label:'Attended',   icon:'✅' },
          { key:'cancelled', label:'Cancelled',  icon:'❌' },
        ].map(c => (
          <div key={c.key} onClick={() => setFilter(c.key)} style={{
            background: filter === c.key ? '#052e16' : '#fff',
            border: `1px solid ${filter === c.key ? '#16a34a' : '#bbf7d0'}`,
            borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: '.15s',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: filter === c.key ? '#86efac' : '#0f172a' }}>{counts[c.key]}</div>
            <div style={{ fontSize: 11, color: filter === c.key ? '#86efac' : '#475569', marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50, color: '#94a3b8' }}>Loading your bookings...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>No {filter !== 'all' ? filter : ''} bookings yet</div>
            <a href="/student/booking" style={{ display: 'inline-block', marginTop: 14, padding: '9px 20px', background: '#16a34a', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              + Book a Meal
            </a>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['#','Date','Meal','Dish','Ordered At','Status','Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: .4, background: '#f0fdf4', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b._id} style={{ borderTop: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12 }}>{i+1}</td>
                  <td style={{ padding: '11px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>{prettyDate(b.bookingDate)}</td>
                  <td style={{ padding: '11px 16px', fontWeight: 600 }}>{b.mealType}</td>
                  <td style={{ padding: '11px 16px', color: '#475569' }}>
                    {b.mealId?.mealName
                      ? <span>{b.mealId.image || '🍛'} {b.mealId.mealName}</span>
                      : <span style={{ color: '#94a3b8', fontSize: 12 }}>Any dish</span>}
                  </td>
                  <td style={{ padding: '11px 16px', color: '#475569', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(b.orderedAt || b.createdAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit', hour12: true,
                    })}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ background: S[b.status]?.bg, color: S[b.status]?.color, padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {S[b.status]?.label}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    {b.status === 'booked' && (
                      <button onClick={() => handleCancel(b._id)} style={{ fontSize: 11, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontWeight: 500 }}>
                        Cancel
                      </button>
                    )}
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

export default HistoryPage;
