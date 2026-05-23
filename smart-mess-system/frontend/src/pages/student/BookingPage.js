// frontend/src/pages/student/BookingPage.js
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { bookingAPI, mealAPI } from '../../services/api';

// ── Date helpers (all local, no UTC shift) ──────────────────────────────────
const getLocalDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const prettyDate = (ymd) => {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

// Get next 7 days as quick-select buttons
const getNextDays = () =>
  Array.from({ length: 7 }, (_, i) => {
    const ymd = getLocalDate(i);
    const [y, m, d] = ymd.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return {
      ymd,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
    };
  });

const MEAL_SLOTS = [
  { type: 'Breakfast', icon: '🥞', time: '7:30 AM – 9:30 AM',  color: '#fef3c7', border: '#fde68a' },
  { type: 'Lunch',     icon: '🍛', time: '12:00 PM – 2:00 PM', color: '#dcfce7', border: '#86efac' },
  { type: 'Dinner',    icon: '🌙', time: '7:00 PM – 9:00 PM',  color: '#ede9fe', border: '#c4b5fd' },
  { type: 'Snacks',    icon: '🍿', time: '4:00 PM – 5:30 PM',  color: '#fee2e2', border: '#fca5a5' },
];

const catTag = {
  Veg:      { bg: '#dcfce7', color: '#14532d' },
  'Non-Veg':{ bg: '#fee2e2', color: '#7f1d1d' },
  Vegan:    { bg: '#dbeafe', color: '#1e3a8a' },
};

const BookingPage = () => {
  const today     = getLocalDate(0);
  const maxDate   = getLocalDate(7);
  const nextDays  = getNextDays();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null); // { type, icon, time }
  const [meals,        setMeals]        = useState([]);   // dishes for selected slot
  const [selectedDish, setSelectedDish] = useState(null); // specific dish (optional)
  const [myBookings,   setMyBookings]   = useState([]);   // today's bookings already made
  const [confirmed,    setConfirmed]    = useState(null); // booking response
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [step,         setStep]         = useState(1);    // 1=date 2=meal 3=confirm

  // Load dishes whenever slot changes
  useEffect(() => {
    if (!selectedSlot) { setMeals([]); return; }
    mealAPI.getAll(selectedSlot.type)
      .then(r => setMeals(r.data.meals))
      .catch(() => setMeals([]));
  }, [selectedSlot]);

  // Load student's existing bookings for selected date
  useEffect(() => {
    bookingAPI.getMy()
      .then(r => {
        const filtered = r.data.bookings.filter(b => b.bookingDate === selectedDate && b.status !== 'cancelled');
        setMyBookings(filtered);
      })
      .catch(() => setMyBookings([]));
  }, [selectedDate, confirmed]);

  const alreadyBooked = (mealType) => myBookings.some(b => b.mealType === mealType);

  const handleBook = async () => {
    if (!selectedSlot) return setError('Please select a meal type');
    setLoading(true); setError('');
    try {
      const payload = {
        mealType:    selectedSlot.type,
        bookingDate: selectedDate,
        mealId:      selectedDish?._id || null,
      };
      const res = await bookingAPI.create(payload);
      setConfirmed(res.data.booking);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setSelectedSlot(null); setSelectedDish(null);
    setConfirmed(null); setError(''); setStep(1);
  };

  // ── STEP 3: Confirmation ─────────────────────────────────────────────────
  if (step === 3 && confirmed) {
    return (
      <MainLayout title="Booking Confirmed">
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 16, padding: 36, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>✅</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: '#052e16', marginBottom: 4 }}>
              Order Placed!
            </h2>
            <p style={{ fontSize: 14, color: '#475569', marginBottom: 28 }}>
              Your meal has been booked and will appear in Admin's dashboard.
            </p>

            {/* QR Code */}
            {confirmed.qrCode && (
              <div style={{ marginBottom: 20 }}>
                <img src={confirmed.qrCode} alt="Booking QR" style={{ width: 190, height: 190, border: '3px solid #052e16', borderRadius: 12 }} />
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>📱 Show at mess entrance for entry</p>
              </div>
            )}

            {/* Details */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              {[
                ['Meal',      confirmed.mealType],
                ['Date',      prettyDate(confirmed.bookingDate)],
                ['Ordered At', new Date(confirmed.orderedAt || confirmed.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })],
                ['Status',    '● Booked'],
                ['Booking ID', confirmed._id],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #dcfce7', fontSize: 13, gap: 10 }}>
                  <span style={{ color: '#475569', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: k === 'Status' ? '#16a34a' : '#0f172a', fontSize: k === 'Booking ID' ? 10 : 13, wordBreak: 'break-all', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={resetFlow} style={{ flex: 1, padding: 11, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, color: '#16a34a', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                + Book Another
              </button>
              <a href="/student/history" style={{ flex: 1, padding: 11, background: 'linear-gradient(135deg,#16a34a,#059669)', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                View History →
              </a>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── STEP 1 + 2: Date → Meal → Dish ──────────────────────────────────────
  return (
    <MainLayout title="Book a Meal">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Info strip */}
        <div style={{ background: 'linear-gradient(90deg,#052e16,#065f46)', color: '#fff', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 13, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <span>Pre-booking guarantees your meal and helps the mess reduce food waste. Book up to 7 days ahead.</span>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '11px 16px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1 — Date Selection */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 22, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>1</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, margin: 0 }}>Select Date</h3>
          </div>

          {/* Quick day buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {nextDays.map(({ ymd, label }) => (
              <button key={ymd} onClick={() => { setSelectedDate(ymd); setSelectedSlot(null); setSelectedDish(null); }} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: 'none', transition: '.15s',
                background: selectedDate === ymd ? '#16a34a' : '#f0fdf4',
                color:      selectedDate === ymd ? '#fff' : '#14532d',
                border:     `1px solid ${selectedDate === ymd ? '#16a34a' : '#bbf7d0'}`,
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Manual date input */}
          <input type="date" value={selectedDate}
            min={today} max={maxDate}
            onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); setSelectedDish(null); }}
            style={{ padding: '9px 14px', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />

          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500, color: '#16a34a' }}>
            📆 {prettyDate(selectedDate)}
          </div>

          {/* Already booked meals for this date */}
          {myBookings.length > 0 && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>⚠️ Already booked on this date:</div>
              <div style={{ fontSize: 12, color: '#92400e' }}>
                {myBookings.map(b => b.mealType).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 — Meal Slot Selection */}
        <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 22, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>2</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, margin: 0 }}>Select Meal</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {MEAL_SLOTS.map(slot => {
              const booked   = alreadyBooked(slot.type);
              const selected = selectedSlot?.type === slot.type;
              return (
                <div key={slot.type} onClick={() => { if (!booked) { setSelectedSlot(slot); setSelectedDish(null); setStep(2); }}}
                  style={{
                    padding: '14px 16px', borderRadius: 11, cursor: booked ? 'not-allowed' : 'pointer',
                    border: `2px solid ${selected ? '#16a34a' : booked ? '#e2e8f0' : slot.border}`,
                    background: selected ? '#f0fdf4' : booked ? '#f8fafc' : slot.color,
                    opacity: booked ? 0.6 : 1, transition: '.15s', position: 'relative',
                  }}>
                  {booked && (
                    <div style={{ position: 'absolute', top: 6, right: 8, background: '#16a34a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>BOOKED</div>
                  )}
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{slot.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{slot.type}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{slot.time}</div>
                  {selected && (
                    <div style={{ position: 'absolute', bottom: 6, right: 8, color: '#16a34a', fontSize: 16 }}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2b — Dishes for selected slot (optional) */}
        {selectedSlot && (
          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, background: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>3</div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, margin: 0 }}>
                {selectedSlot.icon} {selectedSlot.type} Menu
              </h3>
              <span style={{ fontSize: 12, color: '#475569', marginLeft: 4 }}>— choose a dish (optional)</span>
            </div>

            {meals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 13 }}>
                No dishes added to {selectedSlot.type} yet by admin. You can still book the slot.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* "No preference" option */}
                <div onClick={() => setSelectedDish(null)} style={{
                  padding: '10px 14px', borderRadius: 9, cursor: 'pointer',
                  border: `2px solid ${!selectedDish ? '#16a34a' : '#e2e8f0'}`,
                  background: !selectedDish ? '#f0fdf4' : '#f8fafc',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>🍽️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>All Dishes (No preference)</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Serve whatever is available</div>
                  </div>
                  {!selectedDish && <div style={{ marginLeft: 'auto', color: '#16a34a', fontSize: 16 }}>✓</div>}
                </div>

                {meals.map(dish => (
                  <div key={dish._id} onClick={() => setSelectedDish(dish)} style={{
                    padding: '10px 14px', borderRadius: 9, cursor: 'pointer',
                    border: `2px solid ${selectedDish?._id === dish._id ? '#16a34a' : '#e2e8f0'}`,
                    background: selectedDish?._id === dish._id ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'center', gap: 12, transition: '.1s',
                  }}>
                    <span style={{ fontSize: 26 }}>{dish.image || '🍛'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{dish.mealName}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ ...catTag[dish.category], padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{dish.category}</span>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>🔥 {dish.calories} kcal</span>
                        <span style={{ background: '#dbeafe', color: '#1e3a8a', padding: '1px 7px', borderRadius: 20, fontSize: 10 }}>P:{dish.protein}g</span>
                      </div>
                    </div>
                    {selectedDish?._id === dish._id && <div style={{ color: '#16a34a', fontSize: 18 }}>✓</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order Summary + Confirm Button */}
        {selectedSlot && (
          <div style={{ background: 'linear-gradient(135deg,#052e16,#065f46)', borderRadius: 14, padding: 22, color: '#fff' }}>
            <div style={{ fontSize: 13, color: '#86efac', fontWeight: 600, marginBottom: 10 }}>📋 ORDER SUMMARY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
              <span style={{ opacity: .7 }}>Date</span>
              <span style={{ fontWeight: 600 }}>{prettyDate(selectedDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
              <span style={{ opacity: .7 }}>Meal</span>
              <span style={{ fontWeight: 600 }}>{selectedSlot.icon} {selectedSlot.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
              <span style={{ opacity: .7 }}>Time</span>
              <span style={{ fontWeight: 600 }}>{selectedSlot.time}</span>
            </div>
            {selectedDish && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span style={{ opacity: .7 }}>Dish</span>
                <span style={{ fontWeight: 600 }}>{selectedDish.mealName}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.2)', marginTop: 14, paddingTop: 14 }}>
              <button onClick={handleBook} disabled={loading} style={{
                width: '100%', padding: 14,
                background: loading ? '#166534' : '#16a34a',
                border: '2px solid #4ade80', borderRadius: 10, color: '#fff',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans',sans-serif", letterSpacing: .3,
              }}>
                {loading ? '⏳ Placing Order...' : `✅ Confirm ${selectedSlot.type} Booking`}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BookingPage;
