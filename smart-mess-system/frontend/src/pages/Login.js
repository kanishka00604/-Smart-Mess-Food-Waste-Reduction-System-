// frontend/src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #052e16 0%, #065f46 50%, #0f172a 100%)' }}
      className="flex items-center justify-center p-4"
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(74,222,128,0.05)', filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(5,150,105,0.08)', filter: 'blur(40px)'
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: 16, padding: 36,
        position: 'relative'
      }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{
            width: 52, height: 52, background: 'linear-gradient(135deg,#16a34a,#059669)',
            borderRadius: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 14px', fontSize: 24
          }}>🍱</div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 700, color: '#86efac', marginBottom: 4
          }}>Smart Mess System</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
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
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
              style={{
                width: '100%', padding: '10px 14px', fontSize: 13,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: 8, color: '#fff', outline: 'none',
                fontFamily: "'DM Sans', sans-serif"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '10px 14px', fontSize: 13,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: 8, color: '#fff', outline: 'none',
                fontFamily: "'DM Sans', sans-serif"
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#059669)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#86efac', fontWeight: 500, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
