// frontend/src/pages/student/QRPage.js — MODULE 3 (real API)
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QRPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    bookingAPI.getMyQR()
      .then(r => setBooking(r.data.booking))
      .catch(err => setError(err.response?.data?.message || 'No active booking found'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout title="My QR Code">
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>Loading...</div>
        ) : error ? (
          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No Active Booking</h3>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>{error}</p>
            <button onClick={() => navigate('/student/booking')} style={{
              padding: '10px 24px', background: '#16a34a', border: 'none',
              borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>Book a Meal →</button>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>Today's Meal Pass</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
              {booking.mealType} — {new Date(booking.bookingDate).toDateString()}
            </h3>

            {booking.qrCode ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <img src={booking.qrCode} alt="Meal QR Code"
                  style={{ width: 180, height: 180, border: '4px solid #052e16', borderRadius: 10 }} />
              </div>
            ) : (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
                QR not available
              </div>
            )}

            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Booking ID</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 700, color: '#052e16', wordBreak: 'break-all' }}>
                {booking._id}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Name', value: user?.name },
                { label: 'Meal', value: booking.mealType },
                { label: 'Status', value: '● Active', green: true },
              ].map((item, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', minWidth: 100 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: item.green ? '#16a34a' : '#0f172a' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 20 }}>
              📌 Show this at the mess entrance to scan and enter
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default QRPage;
