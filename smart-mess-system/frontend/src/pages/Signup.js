// frontend/src/pages/Signup.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const user = await signup(formData);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: 13,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(74,222,128,0.25)',
    borderRadius: 8, color: '#fff', outline: 'none',
    fontFamily: "'DM Sans', sans-serif"
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: 'rgba(255,255,255,0.6)', marginBottom: 6
  };

  return (
    <div
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #052e16 0%, #065f46 50%, #0f172a 100%)' }}
      className="flex items-center justify-center p-4"
    >
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: 16, padding: 36
      }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{
            width: 52, height: 52, background: 'linear-gradient(135deg,#16a34a,#059669)',
            borderRadius: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 14px', fontSize: 24
          }}>🍱</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>
            Create Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            Join the Smart Mess System
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            color: '#fca5a5', fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Aarav Shah" required style={inputStyle} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="you@college.edu" required style={inputStyle} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Password (min 6 chars)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="••••••••" required style={inputStyle} />
          </div>

          {/* Role */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
              <option value="student" style={{ background: '#052e16' }}>Student</option>
              <option value="admin" style={{ background: '#052e16' }}>Admin</option>
            </select>
          </div>

          {/* Student ID (only if student) */}
          {formData.role === 'student' && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Student ID (optional)</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleChange}
                placeholder="CS21B042" style={inputStyle} />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px', marginTop: 8,
              background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#059669)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#86efac', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
