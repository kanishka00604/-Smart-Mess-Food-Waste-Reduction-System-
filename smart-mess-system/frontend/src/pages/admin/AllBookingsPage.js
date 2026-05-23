// frontend/src/pages/admin/AllBookingsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { bookingAPI } from '../../services/api';

const statusStyle = {
  booked:    { bg: '#dcfce7', color: '#14532d', label: '● Booked'     },
  used:      { bg: '#dbeafe', color: '#1e3a8a', label: '✓ Used'       },
  cancelled: { bg: '#fee2e2', color: '#7f1d1d', label: '✕ Cancelled'  },
};

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const prettyDate = (ymd) => {
  if (!ymd) return '—';
  const [y,m,d] = ymd.split('-').map(Number);
  return new Date(y,m-1,d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
};

const AllBookingsPage = () => {
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [dateFilter,  setDateFilter]  = useState(getToday());
  const [mealFilter,  setMealFilter]  = useState('');
  const [statFilter,  setStatFilter]  = useState('');
  const [msg,         setMsg]         = useState({ text:'', type:'' });
  const [autoRefresh, setAutoRefresh] = useState(true);

  const flash = (text, type='success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 3500);
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFilter) params.date     = dateFilter;
      if (mealFilter) params.mealType = mealFilter;
      if (statFilter) params.status   = statFilter;
      const res = await bookingAPI.adminAll(params);
      setBookings(res.data.bookings || []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, [dateFilter, mealFilter, statFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchBookings, 15000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchBookings]);

  const handleMarkUsed = async (id, name) => {
    try {
      await bookingAPI.markUsed(id);
      flash(`✅ ${name}'s booking marked as used`);
      fetchBookings();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to mark', 'error');
    }
  };

  const counts = {
    all:       bookings.length,
    booked:    bookings.filter(b => b.status === 'booked').length,
    used:      bookings.filter(b => b.status === 'used').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <MainLayout title="All Bookings">

      {msg.text && (
        <div style={{
          background: msg.type === 'error' ? '#fee2e2' : '#dcfce7',
          border: `1px solid ${msg.type === 'error' ? '#fca5a5' : '#86efac'}`,
          color: msg.type === 'error' ? '#dc2626' : '#14532d',
          borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13,
        }}>{msg.text}</div>
      )}

      {/* Summary stat chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total',     value: counts.all,       bg: '#f0fdf4', color: '#14532d' },
          { label: '● Booked',  value: counts.booked,    bg: '#dcfce7', color: '#14532d' },
          { label: '✓ Used',    value: counts.used,      bg: '#dbeafe', color: '#1e3a8a' },
          { label: '✕ Cancelled', value: counts.cancelled, bg: '#fee2e2', color: '#7f1d1d' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 10, padding: '10px 18px', textAlign: 'center', border: `1px solid ${c.bg}` }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 500 }}>{c.label}</div>
          </div>
        ))}

        {/* Auto-refresh toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: autoRefresh ? '#16a34a' : '#94a3b8', animation: autoRefresh ? 'pulse 1.5s infinite' : 'none' }} />
          <span style={{ fontSize: 12, color: '#475569' }}>
            {autoRefresh ? 'Live (refreshes every 15s)' : 'Paused'}
          </span>
          <button onClick={() => setAutoRefresh(!autoRefresh)} style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
            background: autoRefresh ? '#fee2e2' : '#dcfce7',
            border: 'none', color: autoRefresh ? '#dc2626' : '#14532d', fontWeight: 500,
          }}>
            {autoRefresh ? 'Pause' : 'Resume'}
          </button>
          <button onClick={fetchBookings} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#14532d' }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Date</label>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Meal Type</label>
          <select value={mealFilter} onChange={e => setMealFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }}>
            <option value="">All Meals</option>
            {['Breakfast','Lunch','Dinner','Snacks'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Status</label>
          <select value={statFilter} onChange={e => setStatFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }}>
            <option value="">All Status</option>
            {['booked','used','cancelled'].map(s => <option key={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
          </select>
        </div>
        <button onClick={() => { setDateFilter(''); setMealFilter(''); setStatFilter(''); }} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
          ✕ Clear
        </button>
        <button onClick={() => setDateFilter(getToday())} style={{ padding: '8px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#14532d', fontWeight: 500 }}>
          Today
        </button>
      </div>

      {/* Bookings table */}
      <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#475569', marginBottom: 4 }}>No bookings found</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              {dateFilter ? `No bookings on ${prettyDate(dateFilter)}` : 'Try changing the filters'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['#', 'Student Name', 'Roll / Email', 'Meal', 'Dish', 'Date', 'Ordered At', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: .4, background: '#f0fdf4', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id} style={{ borderTop: '1px solid #f1f5f9', transition: '.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '11px 14px', color: '#94a3b8', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{b.studentId?.name || '—'}</div>
                    </td>
                    <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 12 }}>
                      {b.studentId?.studentId || b.studentId?.email || '—'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontWeight: 600 }}>{b.mealType}</span>
                    </td>
                    <td style={{ padding: '11px 14px', color: '#475569' }}>
                      {b.mealId?.mealName ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span>{b.mealId.image || '🍛'}</span>
                          <span>{b.mealId.mealName}</span>
                        </span>
                      ) : <span style={{ color: '#94a3b8', fontSize: 12 }}>Any</span>}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#475569', whiteSpace: 'nowrap' }}>
                      {prettyDate(b.bookingDate)}
                    </td>
                    <td style={{ padding: '11px 14px', color: '#475569', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(b.orderedAt || b.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short',
                        hour: '2-digit', minute: '2-digit', hour12: true,
                      })}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{
                        background: statusStyle[b.status]?.bg,
                        color: statusStyle[b.status]?.color,
                        padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                      }}>
                        {statusStyle[b.status]?.label}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      {b.status === 'booked' && (
                        <button onClick={() => handleMarkUsed(b._id, b.studentId?.name)} style={{
                          fontSize: 11, background: '#dbeafe', color: '#1e3a8a', border: 'none',
                          borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
                        }}>
                          ✓ Mark Used
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pulse animation style */}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </MainLayout>
  );
};

export default AllBookingsPage;
