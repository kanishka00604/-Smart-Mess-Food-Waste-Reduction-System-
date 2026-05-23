// frontend/src/pages/shared/MenuPage.js
import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';

const meals = {
  Breakfast: [
    { name: 'Idli Sambar', cal: 280, protein: 9, carbs: 52, fats: 4, cat: 'Veg', icon: '🥞' },
    { name: 'Poha', cal: 250, protein: 5, carbs: 45, fats: 6, cat: 'Veg', icon: '🌾' },
    { name: 'Masala Dosa', cal: 340, protein: 8, carbs: 58, fats: 10, cat: 'Veg', icon: '🫓' },
  ],
  Lunch: [
    { name: 'Dal Tadka + Rice', cal: 520, protein: 18, carbs: 88, fats: 12, cat: 'Veg', icon: '🍛' },
    { name: 'Chicken Curry', cal: 620, protein: 38, carbs: 40, fats: 22, cat: 'Non-Veg', icon: '🍗' },
    { name: 'Paneer Butter Masala', cal: 580, protein: 22, carbs: 45, fats: 28, cat: 'Veg', icon: '🧀' },
    { name: 'Rajma Chawal', cal: 490, protein: 20, carbs: 82, fats: 8, cat: 'Vegan', icon: '🫘' },
  ],
  Dinner: [
    { name: 'Roti + Sabzi', cal: 380, protein: 12, carbs: 65, fats: 9, cat: 'Veg', icon: '🫓' },
    { name: 'Egg Bhurji + Rice', cal: 440, protein: 24, carbs: 52, fats: 16, cat: 'Non-Veg', icon: '🥚' },
    { name: 'Chole Bhature', cal: 650, protein: 18, carbs: 90, fats: 22, cat: 'Veg', icon: '🫔' },
  ],
};

const catColor = { Veg: '#dcfce7', 'Non-Veg': '#fee2e2', Vegan: '#dbeafe' };
const catText = { Veg: '#14532d', 'Non-Veg': '#7f1d1d', Vegan: '#1e3a8a' };

const MenuPage = () => {
  const [active, setActive] = useState('Lunch');

  return (
    <MainLayout title="Today's Menu">
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {Object.keys(meals).map(t => (
          <button key={t} onClick={() => setActive(t)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans',sans-serif",
            background: active === t ? '#16a34a' : '#fff',
            color: active === t ? '#fff' : '#475569',
            border: `1px solid ${active === t ? '#16a34a' : '#bbf7d0'}`,
          }}>{t}</button>
        ))}
      </div>

      {/* Meal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {meals[active].map((m, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12,
            overflow: 'hidden', transition: '.2s',
          }}>
            <div style={{
              height: 100, background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48
            }}>{m.icon}</div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                <span style={{ background: catColor[m.cat], color: catText[m.cat], padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                  {m.cat}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>🔥 {m.cal} kcal</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {[['P', m.protein, '#dbeafe', '#1e3a8a'], ['C', m.carbs, '#fed7aa', '#7c2d12'], ['F', m.fats, '#ede9fe', '#4c1d95']].map(([k, v, bg, fg]) => (
                  <span key={k} style={{ background: bg, color: fg, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500 }}>
                    {k}: {v}g
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default MenuPage;
