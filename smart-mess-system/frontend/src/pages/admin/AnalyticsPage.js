// frontend/src/pages/admin/AnalyticsPage.js
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const weeklyData = [
  { day: 'Mon', breakfast: 120, lunch: 245, dinner: 180 },
  { day: 'Tue', breakfast: 145, lunch: 289, dinner: 200 },
  { day: 'Wed', breakfast: 130, lunch: 310, dinner: 220 },
  { day: 'Thu', breakfast: 160, lunch: 278, dinner: 190 },
  { day: 'Fri', breakfast: 175, lunch: 320, dinner: 240 },
  { day: 'Sat', breakfast: 90, lunch: 190, dinner: 150 },
  { day: 'Sun', breakfast: 80, lunch: 160, dinner: 130 },
];

const wasteWeek = [
  { day: 'Mon', pct: 12 }, { day: 'Tue', pct: 8 }, { day: 'Wed', pct: 18 },
  { day: 'Thu', pct: 14 }, { day: 'Fri', pct: 10 }, { day: 'Sat', pct: 25 }, { day: 'Sun', pct: 30 },
];

const peakHours = [
  { time: '7AM', count: 45 }, { time: '8AM', count: 120 }, { time: '9AM', count: 80 },
  { time: '12PM', count: 180 }, { time: '1PM', count: 240 }, { time: '2PM', count: 90 },
  { time: '7PM', count: 160 }, { time: '8PM', count: 130 }, { time: '9PM', count: 60 },
];

const AnalyticsPage = () => (
  <MainLayout title="Analytics">
    {/* Summary stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
      {[
        { label: 'Avg Daily Bookings', value: '256', trend: '+12%', up: true },
        { label: 'Waste Reduced (Week)', value: '18%', trend: '-6% vs last week', up: true },
        { label: 'Peak Hour', value: '1:00 PM', trend: 'Lunch crowd', up: null },
        { label: 'Satisfaction Rate', value: '87%', trend: '+3% vs last month', up: true },
      ].map((s, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700 }}>{s.value}</div>
          <div style={{ fontSize: 11, marginTop: 4, color: s.up === true ? '#16a34a' : s.up === false ? '#dc2626' : '#475569' }}>{s.trend}</div>
        </div>
      ))}
    </div>

    {/* Line Chart - weekly bookings by meal */}
    <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20, marginBottom: 14 }}>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
        📈 Weekly Bookings by Meal Type
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="breakfast" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lunch" stroke="#16a34a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="dinner" stroke="#0d9488" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
        {[['Breakfast', '#f59e0b'], ['Lunch', '#16a34a'], ['Dinner', '#0d9488']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 12, height: 3, background: c, borderRadius: 2 }} />
            <span style={{ color: '#475569' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {/* Waste trend */}
      <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          ♻️ Waste % This Week
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={wasteWeek}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="%" />
            <Tooltip />
            <Bar dataKey="pct" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Hours */}
      <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          ⏰ Peak Mess Hours
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={peakHours}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </MainLayout>
);

export default AnalyticsPage;
