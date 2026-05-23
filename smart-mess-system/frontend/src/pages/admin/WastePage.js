// frontend/src/pages/admin/WastePage.js — MODULE 3 (real API)
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { wasteAPI } from '../../services/api';

const getColor = (pct) => pct < 15 ? '#16a34a' : pct < 25 ? '#f59e0b' : '#ef4444';

const WastePage = () => {
  const [logs, setLogs] = useState([]);
  const [prepared, setPrepared] = useState('');
  const [consumed, setConsumed] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchLogs = () => {
    wasteAPI.getAll().then(r => setLogs(r.data.logs)).catch(() => {});
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSubmit = async () => {
    if (!prepared || !consumed) return setError('Fill all fields');
    setLoading(true); setError(''); setSuccess('');
    try {
      await wasteAPI.log({ date, mealType, preparedQuantity: prepared, consumedQuantity: consumed });
      setSuccess(`✅ Waste logged for ${mealType}!`);
      setPrepared(''); setConsumed('');
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log waste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Waste Tracker">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
        {/* Log form */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Log Waste</h3>
          {error && <div style={{ background: '#fee2e2', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
          {success && <div style={{ background: '#dcfce7', borderRadius: 8, padding: '10px 14px', color: '#14532d', fontSize: 13, marginBottom: 14 }}>{success}</div>}

          {[
            { label: 'Date', type: 'date', value: date, set: setDate },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>Meal Type</label>
            <select value={mealType} onChange={e => setMealType(e.target.value)} style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }}>
              {['Breakfast', 'Lunch', 'Dinner'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>Prepared (plates)</label>
            <input type="number" value={prepared} onChange={e => setPrepared(e.target.value)} placeholder="e.g. 320" style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>Consumed (plates)</label>
            <input type="number" value={consumed} onChange={e => setConsumed(e.target.value)} placeholder="e.g. 280" style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: 11,
            background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#059669)',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
          }}>{loading ? 'Saving...' : 'Log Waste'}</button>
        </div>

        {/* History */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Waste History</h3>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 14 }}>No data yet. Log your first entry.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Date', 'Meal', 'Prepared', 'Consumed', 'Waste%'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, color: '#475569', textTransform: 'uppercase', background: '#f0fdf4' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((w, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '9px 10px', color: '#475569' }}>{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ padding: '9px 10px', fontWeight: 500 }}>{w.mealType}</td>
                    <td style={{ padding: '9px 10px' }}>{w.preparedQuantity}</td>
                    <td style={{ padding: '9px 10px' }}>{w.consumedQuantity}</td>
                    <td style={{ padding: '9px 10px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: w.wastePercentage < 15 ? '#dcfce7' : w.wastePercentage < 25 ? '#fef3c7' : '#fee2e2',
                        color: getColor(w.wastePercentage),
                      }}>{w.wastePercentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WastePage;
