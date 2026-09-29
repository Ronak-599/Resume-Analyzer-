import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AtsScoreModal = ({ isOpen, onClose, atsData, jobTitle, company, onApply, isAlreadyApplied }) => {
  if (!isOpen || !atsData) return null;

  const score = atsData.score || 0;
  
  // Trigger celebration confetti on high score!
  React.useEffect(() => {
    if (score >= 80) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [score]);

  const getScoreColor = () => {
    if (score > 80) return '#10b981';
    if (score >= 60) return '#0ea5e9';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getBadgeClass = () => {
    if (score > 80) return 'badge-excellent';
    if (score >= 60) return 'badge-good';
    if (score >= 40) return 'badge-average';
    return 'badge-poor';
  };

  const color = getScoreColor();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <FileCheck size={16} /> ATS Resume Match Analysis
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '4px' }}>{jobTitle}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{company}</p>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Score & Gauge Section */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Circular Score Gauge */}
          <div className="gauge-container">
            <div 
              className="gauge-circle"
              style={{
                border: `6px solid ${color}`,
                boxShadow: `0 0 20px ${color}33`,
                background: 'rgba(0,0,0,0.2)'
              }}
            >
              <span style={{ fontSize: '2.4rem', color: '#fff', lineHeight: 1 }}>{Math.round(score)}%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>ATS SCORE</span>
            </div>
          </div>

          {/* Classification & Summary */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className={`badge ${getBadgeClass()}`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                <TrendingUp size={14} /> {atsData.matchLevel}
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '12px' }}>
              {atsData.feedbackSummary}
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Matched <strong>{atsData.totalMatched}</strong> out of <strong>{atsData.totalRequired}</strong> required skills ({Math.round(score)}% keyword alignment).
            </div>
          </div>
        </div>

        {/* Skill Match Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Matched Skills */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <CheckCircle2 size={16} /> Matched Skills ({atsData.matchedSkills?.length || 0})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {atsData.matchedSkills && atsData.matchedSkills.length > 0 ? (
                atsData.matchedSkills.map((s, idx) => (
                  <span key={idx} className="skill-tag skill-tag-matched">✓ {s}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No overlapping skills found</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <AlertCircle size={16} /> Missing Keywords ({atsData.missingSkills?.length || 0})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {atsData.missingSkills && atsData.missingSkills.length > 0 ? (
                atsData.missingSkills.map((s, idx) => (
                  <span key={idx} className="skill-tag skill-tag-missing">✕ {s}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#34d399' }}>None! All required skills matched!</span>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        {atsData.recommendations && atsData.recommendations.length > 0 && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.07)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Lightbulb size={16} /> Resume Optimization Suggestions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              {atsData.recommendations.map((rec, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#818cf8' }}>•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close Analysis
          </button>
          {onApply && !isAlreadyApplied && (
            <button 
              onClick={() => {
                onApply();
                onClose();
              }} 
              className="btn btn-primary"
            >
              <ArrowRight size={16} /> Apply for Position
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtsScoreModal;
