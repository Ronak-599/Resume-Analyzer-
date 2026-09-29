import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Building2, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const JobCard = ({ job, onCheckAts, onApply, isApplied, atsScore }) => {
  const skills = job.requiredSkills ? job.requiredSkills.split(',').map(s => s.trim()) : [];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Company Avatar */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--primary-light)'
            }}>
              {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                <Link to={`/jobs/${job.id}`} style={{ color: '#fff', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-light)'} onMouseLeave={(e) => e.target.style.color = '#fff'}>
                  {job.title}
                </Link>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Building2 size={14} />
                <span>{job.company}</span>
              </div>
            </div>
          </div>

          {/* Job Type Badge */}
          <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
            {job.jobType ? job.jobType.replace('_', ' ') : 'FULL TIME'}
          </span>
        </div>

        {/* Location, Salary, Experience Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={15} color="var(--primary-light)" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
              <DollarSign size={15} />
              <span>{job.salary}</span>
            </div>
          )}
          {job.experience && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={15} color="#ec4899" />
              <span>{job.experience}</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p style={{
          color: '#cbd5e1',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description}
        </p>

        {/* Skills Required */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {skills.slice(0, 6).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {skills.length > 6 && (
            <span className="skill-tag" style={{ color: 'var(--primary-light)' }}>
              +{skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '16px'
      }}>
        {/* ATS Match Preview Trigger */}
        <button
          onClick={() => onCheckAts(job)}
          className="btn btn-secondary btn-sm"
          style={{ borderColor: 'var(--border-glow)' }}
        >
          <Sparkles size={14} color="var(--primary-light)" />
          <span>Check ATS Score</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          {isApplied ? (
            <span className="badge badge-excellent" style={{ padding: '8px 12px' }}>
              <CheckCircle size={14} /> Applied
            </span>
          ) : (
            <button onClick={() => onApply(job.id)} className="btn btn-primary btn-sm">
              <span>Apply</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
