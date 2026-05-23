// frontend/src/pages/admin/AIPage.js
import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';

const history = [
  { date: '30 Aug', predicted: 285, actual: 291, accuracy: '97.9%' },
  { date: '29 Aug', predicted: 270, actual: 265, accuracy: '98.1%' },
  { date: '28 Aug', predicted: 310, actual: 304, accuracy: '98.1%' },
  { date: '27 Aug', predicted: 180, actual: 195, accuracy: '92.3%' },
];

const AIPage = () => {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runPrediction = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 2500);
  };

  return (
    <MainLayout title="AI Prediction">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Prediction card */}
        <div>
          <div style={{
            background: 'linear-gradient(135deg,#052e16,#065f46)',
            borderRadius: 14, padding: 28, color: '#fff', marginBottom: 14,
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(74,222,128,.08)' }} />
            <div style={{ fontSize: 12, color: '#86efac', fontWeight: 600, marginBottom: 10 }}>🤖 AI PREDICTION ENGINE</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 42, fontWeight: 700 }}>
              {done ? '291' : '---'}
            </div>
            <div style={{ fontSize: 13, opacity: .7, marginBottom: 14 }}>Expected students tomorrow</div>
            {done && (
              <div>
                <div style={{ display: 'inline-block', background: 'rgba(74,222,128,.2)', border: '1px solid rgba(74,222,128,.3)', padding: '4px 12px', borderRadius: 20, fontSize: 12, color: '#86efac', marginBottom: 8 }}>
                  94.2% confidence
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, opacity: .8 }}>
                  <span>☀️ Breakfast: ~87</span>
                  <span>🍛 Lunch: ~131</span>
                  <span>🌙 Dinner: ~73</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
              Run Tomorrow's Prediction
            </h3>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>
              Uses booking trends, day-of-week patterns, and historical data to predict demand.
            </p>
            <button onClick={runPrediction} disabled={running} style={{
              width: '100%', padding: 12,
              background: running ? '#166534' : 'linear-gradient(135deg,#16a34a,#059669)',
              border: 'none', borderRadius: 8, color: '#fff', fontSize: 14,
              fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif"
            }}>
              {running ? '⚡ Running model...' : done ? '🔄 Run Again' : '▶️ Run AI Prediction'}
            </button>
            {done && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#dcfce7', borderRadius: 8, fontSize: 13, color: '#14532d', fontWeight: 500 }}>
                ✅ Model updated! Prepare for 291 students tomorrow.
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
            Prediction History
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Date', 'Predicted', 'Actual', 'Accuracy'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#475569', textTransform: 'uppercase', background: '#f0fdf4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>{r.date}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.predicted}</td>
                  <td style={{ padding: '10px 12px' }}>{r.actual}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: '#dcfce7', color: '#14532d', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {r.accuracy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#14532d', marginBottom: 6 }}>📊 Model Info</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              Algorithm: Random Forest Regressor<br />
              Features: Day of week, bookings, weather, events<br />
              Training data: Last 6 months<br />
              Average accuracy: <strong style={{ color: '#16a34a' }}>96.6%</strong>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIPage;
