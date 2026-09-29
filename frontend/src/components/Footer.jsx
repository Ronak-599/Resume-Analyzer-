import React from 'react';
import { Briefcase, Code, Database, Cpu, CheckCircle2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '50px 20px 30px',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Briefcase size={18} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>SmartJob &amp; ATS</span>
            </div>
            <p style={{ lineHeight: 1.6, fontSize: '0.85rem', marginBottom: '16px' }}>
              Next-generation Full Stack recruitment platform featuring automated ATS resume parsing, skill extraction, matching algorithms, and candidate analytics.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={16} color="var(--primary-light)" /> Backend Architecture
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <li>• Java 21 &amp; Spring Boot 3.3</li>
              <li>• Spring Security &amp; Stateless JWT</li>
              <li>• Spring Data JPA &amp; Hibernate</li>
              <li>• Apache PDFBox &amp; Apache POI Parser</li>
              <li>• MySQL / H2 Multi-Profile Database</li>
            </ul>
          </div>

          {/* ATS Engine Details */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="#ec4899" /> ATS Scoring Formula
            </h4>
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#a5b4fc',
              marginBottom: '10px'
            }}>
              Score = (Matched Skills / Required Skills) * 100
            </div>
            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#34d399' }}>✓ &gt; 80% : Excellent Match</span>
              <span style={{ color: '#38bdf8' }}>✓ 60-80% : Good Match</span>
              <span style={{ color: '#fbbf24' }}>✓ 40-60% : Average Match</span>
              <span style={{ color: '#f87171' }}>✓ &lt; 40% : Poor Match</span>
            </div>
          </div>

          {/* Interview Question Highlight */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} color="#34d399" /> Interview Concepts
            </h4>
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.8rem'
            }}>
              <p style={{ color: '#e0e7ff', fontWeight: 600, marginBottom: '6px' }}>Q: Why JWT instead of Session?</p>
              <p style={{ color: 'var(--text-muted)' }}>JWT is stateless, scales horizontally without centralized session memory, and is ideal for decoupled REST APIs.</p>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} Smart Job Portal &amp; ATS Resume Engine. Production Ready Full Stack Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with Java 21, Spring Boot, React, and MySQL
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
