// frontend/src/pages/shared/FeedbackPage.js — MODULE 3 (real API)
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { feedbackAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const sentStyle = {
  Positive: { bg: '#dcfce7', color: '#14532d', icon: '😊' },
  Negative: { bg: '#fee2e2', color: '#7f1d1d', icon: '😞' },
  Neutral:  { bg: '#fef3c7', color: '#92400e', icon: '😐' },
};

const FeedbackPage = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [meal, setMeal] = useState('Lunch');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [myFeedback, setMyFeedback] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      feedbackAPI.adminAll().then(r => setAdminData(r.data)).catch(() => {});
    } else {
      feedbackAPI.getMy().then(r => setMyFeedback(r.data.feedback)).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await feedbackAPI.create({ rating, comment, meal });
      setResult(res.data.feedback);
      setSubmitted(true);
      // Refresh my feedback list
      feedbackAPI.getMy().then(r => setMyFeedback(r.data.feedback)).catch(() => {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setSubmitted(false); setResult(null); setComment(''); setRating(4); };

  const feedbackList = user?.role === 'admin' ? (adminData?.feedback || []) : myFeedback;

  return (
    <MainLayout title="Feedback">
      {user?.role === 'admin' && adminData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Avg Rating', value: `${adminData.avgRating} ⭐`, color: '#f59e0b' },
            { label: '😊 Positive', value: adminData.summary?.Positive || 0, color: '#16a34a' },
            { label: '😞 Negative', value: adminData.summary?.Negative || 0, color: '#dc2626' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'admin' ? '1fr' : '1fr 1fr', gap: 20 }}>
        {user?.role !== 'admin' && (
          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 24 }}>
            {!submitted ? (
              <>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Rate Today's Meal</h3>
                {error && <div style={{ background: '#fee2e2', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>Meal Type</label>
                  <select value={meal} onChange={e => setMeal(e.target.value)} style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }}>
                    {['Breakfast', 'Lunch', 'Dinner'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 8 }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1,2,3,4,5].map(r => (
                      <button key={r} onClick={() => setRating(r)} style={{
                        width: 42, height: 42, borderRadius: 8, fontSize: 20,
                        border: `2px solid ${rating >= r ? '#f59e0b' : '#e2e8f0'}`,
                        background: rating >= r ? '#fef3c7' : '#f8fafc', cursor: 'pointer'
                      }}>⭐</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>Your Comment</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Tell us about your experience..." rows={4} style={{
                      width: '100%', padding: '10px 12px', fontSize: 13,
                      border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none',
                      resize: 'vertical', fontFamily: "'DM Sans',sans-serif"
                    }} />
                </div>
                <button onClick={handleSubmit} disabled={loading} style={{
                  width: '100%', padding: 12,
                  background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#059669)',
                  border: 'none', borderRadius: 8, color: '#fff', fontSize: 14,
                  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif"
                }}>{loading ? 'Submitting...' : 'Submit Feedback'}</button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>{sentStyle[result?.sentiment]?.icon || '✅'}</div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700 }}>Thank you!</h3>
                <p style={{ fontSize: 13, color: '#475569', margin: '8px 0 16px' }}>Your feedback has been saved.</p>
                {result?.sentiment && (
                  <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20, ...sentStyle[result.sentiment] }}>
                    {sentStyle[result.sentiment].icon} Sentiment: {result.sentiment}
                  </div>
                )}
                <br />
                <button onClick={handleReset} style={{ padding: '8px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#16a34a', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Give More Feedback
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feedback List */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            {user?.role === 'admin' ? 'All Student Feedback' : 'Your Past Feedback'}
          </h3>
          {feedbackList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8', fontSize: 13 }}>No feedback yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
              {feedbackList.map((f, i) => (
                <div key={i} style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {user?.role === 'admin' ? f.studentId?.name : f.mealId?.mealName || 'Meal'}
                    </span>
                    <span style={{ ...sentStyle[f.sentiment], fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                      {sentStyle[f.sentiment]?.icon} {f.sentiment}
                    </span>
                  </div>
                  <div style={{ color: '#f59e0b', marginBottom: 4, fontSize: 14 }}>{'⭐'.repeat(f.rating)}</div>
                  {f.comment && <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{f.comment}</p>}
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>
                    {new Date(f.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FeedbackPage;
