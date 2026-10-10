import React, { useState } from 'react';
import { GraduationCap, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AuthView({ onAuthSuccess, classes = [] }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('Grade 10 - Section A');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register({
        name,
        email,
        password,
        rollNumber,
        phone,
        className,
      });
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Accounts
  const loginAsDemo = async (demoEmail, demoPass) => {
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email: demoEmail, password: demoPass });
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-icon">
            <GraduationCap size={32} />
          </div>
          <h2>EduManage Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {isLogin ? 'Sign in to access your academic dashboard' : 'Create your student account to submit homework'}
          </p>
        </div>

        {error && (
          <div className="badge badge-rose" style={{ width: '100%', padding: '0.65rem 1rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student Email</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="alex@student.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="STU-1001"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Class / Section</label>
                <select
                  className="form-select"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                >
                  <option value="Grade 10 - Section A">Grade 10 - Section A</option>
                  <option value="Grade 10 - Section B">Grade 10 - Section B</option>
                  <option value="Grade 11 - Science">Grade 11 - Science</option>
                  <option value="Grade 12 - Commerce">Grade 12 - Commerce</option>
                  <option value="Unassigned">Unassigned (Teacher will assign)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1-555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <UserPlus size={18} />
              {loading ? 'Registering...' : 'Register as Student'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? "Don't have an account? Register as Student" : 'Already registered? Sign In'}
          </button>
        </div>

        {/* Instant 1-Click Demo Buttons */}
        <div className="demo-account-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={14} color="#8b5cf6" />
            <h4 style={{ margin: 0 }}>Instant 1-Click Demo Logins</h4>
          </div>
          <div className="demo-btn-grid">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loginAsDemo('teacher@school.com', 'admin123')}
              disabled={loading}
            >
              🎓 Teacher Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loginAsDemo('alex@student.com', 'student123')}
              disabled={loading}
            >
              🎒 Student (Alex)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
