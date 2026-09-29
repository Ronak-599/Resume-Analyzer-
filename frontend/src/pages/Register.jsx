import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('CANDIDATE');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const payload = {
      ...formData,
      role
    };

    const result = await register(payload);
    if (result.success) {
      if (role === 'CANDIDATE') navigate('/candidate');
      else navigate('/recruiter');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <UserPlus size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join SmartJob to analyze resumes or recruit top engineering talent
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          background: 'var(--bg-surface-elevated)',
          padding: '6px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setRole('CANDIDATE')}
            className="btn"
            style={{
              background: role === 'CANDIDATE' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: role === 'CANDIDATE' ? '#fff' : 'var(--text-muted)',
              boxShadow: role === 'CANDIDATE' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            <User size={16} /> Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className="btn"
            style={{
              background: role === 'RECRUITER' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
              color: role === 'RECRUITER' ? '#fff' : 'var(--text-muted)',
              boxShadow: role === 'RECRUITER' ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none'
            }}
          >
            <Building size={16} /> Recruiter
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Ronak Pawar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {role === 'RECRUITER' && (
            <div className="form-group">
              <label className="form-label">Company / Organization *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. TechCorp Innovations"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                minLength="6"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1 or +91 format"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
