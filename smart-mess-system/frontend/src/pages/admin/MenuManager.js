// frontend/src/pages/admin/MenuManager.js
// Admin can ADD, EDIT, DELETE, and TOGGLE dishes in the menu
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { mealAPI } from '../../services/api';

const MEAL_TYPES  = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const CATEGORIES  = ['Veg', 'Non-Veg', 'Vegan'];
const EMOJI_OPTIONS = ['🍛','🥞','🌾','🫓','🍗','🧀','🫘','🥚','🫔','🥗','🍲','🥘','🍜','🫕','🥙','🌮','🍱','🥟'];

const emptyForm = {
  mealName: '', mealType: 'Lunch', category: 'Veg',
  calories: '', protein: '', carbs: '', fats: '', image: '🍛',
};

const catColor = {
  Veg:      { bg: '#dcfce7', color: '#14532d' },
  'Non-Veg':{ bg: '#fee2e2', color: '#7f1d1d' },
  Vegan:    { bg: '#dbeafe', color: '#1e3a8a' },
};

const inp = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  border: '1px solid #bbf7d0', borderRadius: 8, outline: 'none',
  fontFamily: "'DM Sans',sans-serif", background: '#fff',
};

const MenuManager = () => {
  const [meals,      setMeals]      = useState([]);
  const [form,       setForm]       = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [activeTab,  setActiveTab]  = useState('Lunch');
  const [showForm,   setShowForm]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [deleteConf, setDeleteConf] = useState(null);

  const fetchMeals = async () => {
    setFetching(true);
    try {
      const res = await mealAPI.getAll();
      setMeals(res.data.meals);
    } catch { setMeals([]); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchMeals(); }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000); }
    else         { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.mealName.trim()) return flash('Dish name is required', true);
    setLoading(true);
    try {
      if (editId) {
        await mealAPI.update(editId, form);
        flash('✅ Dish updated successfully!');
      } else {
        await mealAPI.create(form);
        flash('✅ Dish added to menu!');
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      fetchMeals();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to save dish', true);
    } finally { setLoading(false); }
  };

  const handleEdit = (meal) => {
    setForm({
      mealName: meal.mealName, mealType: meal.mealType,
      category: meal.category, calories: meal.calories,
      protein: meal.protein, carbs: meal.carbs,
      fats: meal.fats, image: meal.image || '🍛',
    });
    setEditId(meal._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await mealAPI.delete(id);
      flash('🗑️ Dish removed from menu');
      setDeleteConf(null);
      fetchMeals();
    } catch { flash('Failed to delete', true); }
  };

  const handleToggle = async (meal) => {
    try {
      await mealAPI.toggle(meal._id);
      flash(`${meal.isAvailable ? '⛔ Dish hidden' : '✅ Dish made visible'} from student menu`);
      fetchMeals();
    } catch { flash('Failed to toggle', true); }
  };

  const cancelForm = () => { setForm(emptyForm); setEditId(null); setShowForm(false); setError(''); };

  const filtered = meals.filter(m => m.mealType === activeTab);

  return (
    <MainLayout title="Menu Manager">

      {/* Alerts */}
      {error   && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'10px 16px', marginBottom:14, color:'#dc2626', fontSize:13 }}>⚠️ {error}</div>}
      {success && <div style={{ background:'#dcfce7', border:'1px solid #86efac', borderRadius:8, padding:'10px 16px', marginBottom:14, color:'#14532d', fontSize:13 }}>{success}</div>}

      {/* Delete Confirmation Modal */}
      {deleteConf && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:14, padding:28, maxWidth:360, width:'90%', textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🗑️</div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:700, marginBottom:8 }}>Delete this dish?</h3>
            <p style={{ fontSize:13, color:'#475569', marginBottom:20 }}>
              <strong>{deleteConf.mealName}</strong> will be permanently removed from the menu.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setDeleteConf(null)} style={{ padding:'9px 22px', background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:500 }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConf._id)} style={{ padding:'9px 22px', background:'#dc2626', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background:'#fff', border:'2px solid #16a34a', borderRadius:14, padding:24, marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:700, color:'#052e16', margin:0 }}>
              {editId ? '✏️ Edit Dish' : '➕ Add New Dish'}
            </h3>
            <button onClick={cancelForm} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {/* Dish Name */}
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6, fontWeight:500 }}>Dish Name *</label>
              <input name="mealName" value={form.mealName} onChange={handleChange}
                placeholder="e.g. Dal Tadka, Chicken Biryani" style={inp} />
            </div>

            {/* Meal Type */}
            <div>
              <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6, fontWeight:500 }}>Meal Type *</label>
              <select name="mealType" value={form.mealType} onChange={handleChange} style={inp}>
                {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6, fontWeight:500 }}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} style={inp}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Nutrition */}
            {[
              { name:'calories', label:'Calories (kcal)', placeholder:'e.g. 520' },
              { name:'protein',  label:'Protein (g)',     placeholder:'e.g. 18'  },
              { name:'carbs',    label:'Carbs (g)',       placeholder:'e.g. 88'  },
              { name:'fats',     label:'Fats (g)',        placeholder:'e.g. 12'  },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6, fontWeight:500 }}>{f.label}</label>
                <input type="number" name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} min="0" style={inp} />
              </div>
            ))}

            {/* Emoji Picker */}
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:8, fontWeight:500 }}>Dish Icon (emoji)</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} type="button" onClick={() => setForm({...form, image: e})} style={{
                    width:42, height:42, fontSize:22, borderRadius:8, cursor:'pointer',
                    border: form.image === e ? '2px solid #16a34a' : '2px solid #e2e8f0',
                    background: form.image === e ? '#f0fdf4' : '#f8fafc',
                  }}>{e}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginTop:16, padding:'12px 16px', background:'#f0fdf4', borderRadius:10, display:'flex', alignItems:'center', gap:14, border:'1px solid #bbf7d0' }}>
            <span style={{ fontSize:36 }}>{form.image}</span>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{form.mealName || 'Dish Name'}</div>
              <div style={{ fontSize:12, color:'#475569' }}>{form.mealType} • {form.category} • {form.calories || 0} kcal</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>
                P:{form.protein||0}g  C:{form.carbs||0}g  F:{form.fats||0}g
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:10, marginTop:18 }}>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex:1, padding:11,
              background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#059669)',
              border:'none', borderRadius:9, color:'#fff', fontSize:14,
              fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily:"'DM Sans',sans-serif"
            }}>
              {loading ? 'Saving...' : editId ? '✏️ Update Dish' : '➕ Add to Menu'}
            </button>
            <button onClick={cancelForm} style={{
              padding:'11px 20px', background:'#f1f5f9', border:'1px solid #e2e8f0',
              borderRadius:9, fontSize:13, fontWeight:500, cursor:'pointer'
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        {/* Meal type tabs */}
        <div style={{ display:'flex', gap:8 }}>
          {MEAL_TYPES.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:500,
              cursor:'pointer', border:'none',
              background: activeTab === t ? '#16a34a' : '#fff',
              color:      activeTab === t ? '#fff' : '#475569',
              border: `1px solid ${activeTab === t ? '#16a34a' : '#bbf7d0'}`,
            }}>
              {t} ({meals.filter(m => m.mealType === t).length})
            </button>
          ))}
        </div>

        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} style={{
            padding:'9px 20px', background:'linear-gradient(135deg,#16a34a,#059669)',
            border:'none', borderRadius:9, color:'#fff', fontSize:13,
            fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif"
          }}>
            ➕ Add New Dish
          </button>
        )}
      </div>

      {/* Meals Grid */}
      {fetching ? (
        <div style={{ textAlign:'center', padding:60, color:'#94a3b8' }}>Loading menu...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'#94a3b8' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🍽️</div>
          <div style={{ fontSize:15, fontWeight:500 }}>No dishes in {activeTab} yet</div>
          <div style={{ fontSize:13, marginTop:4 }}>Click "Add New Dish" to add the first one</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {filtered.map(meal => (
            <div key={meal._id} style={{
              background:'#fff', border:'1px solid #bbf7d0', borderRadius:12,
              overflow:'hidden', opacity: meal.isAvailable ? 1 : 0.6,
              transition:'.2s', position:'relative',
            }}>
              {/* Unavailable badge */}
              {!meal.isAvailable && (
                <div style={{ position:'absolute', top:8, right:8, background:'#ef4444', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, zIndex:1 }}>
                  HIDDEN
                </div>
              )}

              {/* Icon banner */}
              <div style={{ height:80, background:'linear-gradient(135deg,#dcfce7,#bbf7d0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42 }}>
                {meal.image || '🍛'}
              </div>

              <div style={{ padding:'12px 14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#0f172a', flex:1 }}>{meal.mealName}</div>
                  <span style={{ ...catColor[meal.category], padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600, marginLeft:6, flexShrink:0 }}>
                    {meal.category}
                  </span>
                </div>

                <div style={{ fontSize:12, color:'#16a34a', fontWeight:600, marginBottom:6 }}>🔥 {meal.calories} kcal</div>

                {/* Nutrition badges */}
                <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
                  {[['P', meal.protein, '#dbeafe','#1e3a8a'], ['C', meal.carbs, '#fed7aa','#7c2d12'], ['F', meal.fats, '#ede9fe','#4c1d95']].map(([k,v,bg,fg]) => (
                    <span key={k} style={{ background:bg, color:fg, padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:500 }}>
                      {k}: {v}g
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => handleEdit(meal)} style={{
                    flex:1, padding:'7px', background:'#f0fdf4', border:'1px solid #bbf7d0',
                    borderRadius:7, color:'#14532d', fontSize:12, fontWeight:500, cursor:'pointer'
                  }}>✏️ Edit</button>
                  <button onClick={() => handleToggle(meal)} style={{
                    flex:1, padding:'7px',
                    background: meal.isAvailable ? '#fef3c7' : '#dcfce7',
                    border: `1px solid ${meal.isAvailable ? '#fde68a' : '#86efac'}`,
                    borderRadius:7,
                    color: meal.isAvailable ? '#92400e' : '#14532d',
                    fontSize:12, fontWeight:500, cursor:'pointer'
                  }}>
                    {meal.isAvailable ? '⛔ Hide' : '✅ Show'}
                  </button>
                  <button onClick={() => setDeleteConf(meal)} style={{
                    padding:'7px 10px', background:'#fee2e2', border:'1px solid #fca5a5',
                    borderRadius:7, color:'#dc2626', fontSize:14, cursor:'pointer'
                  }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default MenuManager;
