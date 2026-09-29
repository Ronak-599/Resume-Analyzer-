import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  FileText, 
  Layers, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Sparkles,
  UserCheck,
  Building,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleDemoSwitch = async (role) => {
    setSwitching(true);
    await demoLogin(role);
    setSwitching(false);
    if (role === 'CANDIDATE') navigate('/candidate');
    else if (role === 'RECRUITER') navigate('/recruiter');
    else if (role === 'ADMIN') navigate('/admin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Top Demo Bar for Instant Role Switching */}
      <div style={{
        background: 'linear-gradient(90deg, #1e1b4b 0%, #311042 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '5px 20px',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c7d2fe' }}>
          <Sparkles size={14} style={{ color: '#ec4899' }} />
          <span><strong>Quick Demo Mode:</strong> Test user workflows instantly</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => handleDemoSwitch('CANDIDATE')} 
            disabled={switching}
            className="btn btn-sm"
            style={{ 
              background: user?.role === 'CANDIDATE' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)', 
              color: '#fff', 
              padding: '2px 10px', 
              fontSize: '0.75rem' 
            }}
          >
            <UserCheck size={12} /> Candidate (Ronak)
          </button>
          <button 
            onClick={() => handleDemoSwitch('RECRUITER')} 
            disabled={switching}
            className="btn btn-sm"
            style={{ 
              background: user?.role === 'RECRUITER' ? '#ec4899' : 'rgba(255, 255, 255, 0.1)', 
              color: '#fff', 
              padding: '2px 10px', 
              fontSize: '0.75rem' 
            }}
          >
            <Building size={12} /> Recruiter (TechCorp)
          </button>
          <button 
            onClick={() => handleDemoSwitch('ADMIN')} 
            disabled={switching}
            className="btn btn-sm"
            style={{ 
              background: user?.role === 'ADMIN' ? '#10b981' : 'rgba(255, 255, 255, 0.1)', 
              color: '#fff', 
              padding: '2px 10px', 
              fontSize: '0.75rem' 
            }}
          >
            <ShieldCheck size={12} /> Admin
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Briefcase size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Smart</span>
              <span style={{ 
                background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>JobPortal</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              &amp; ATS Resume Engine
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav">
          <Link 
            to="/jobs" 
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/jobs') ? '#fff' : 'var(--text-muted)',
              background: isActive('/jobs') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={16} /> Explore Jobs
          </Link>

          {(user?.role === 'CANDIDATE' || user?.role === 'ADMIN') && (
            <Link 
              to="/candidate" 
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/candidate') ? '#fff' : 'var(--text-muted)',
                background: isActive('/candidate') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileText size={16} /> Candidate Hub
            </Link>
          )}

          {(user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
            <Link 
              to="/recruiter" 
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/recruiter') ? '#fff' : 'var(--text-muted)',
                background: isActive('/recruiter') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={16} /> Recruiter Hub
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin" 
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/admin') ? '#fff' : 'var(--text-muted)',
                background: isActive('/admin') ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={16} color="#34d399" /> Admin Console
            </Link>
          )}
        </nav>

        {/* User Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{user.name}</div>
                <span className={`badge ${
                  user.role === 'ADMIN' ? 'badge-excellent' : 
                  user.role === 'RECRUITER' ? 'badge-good' : 'badge-neutral'
                }`}>
                  {user.role}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary btn-sm"
                title="Logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} /> Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
