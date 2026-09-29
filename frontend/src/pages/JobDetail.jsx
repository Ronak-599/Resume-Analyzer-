import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileCheck,
  Send,
  Calendar
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atsData, setAtsData] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    if (isAuthenticated) {
      checkApplicationStatus();
      fetchAtsScore();
    }
  }, [id, isAuthenticated]);

  const fetchJobDetail = async () => {
    try {
      const res = await axiosClient.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await axiosClient.get('/applications/my-applications');
      const found = res.data.find(app => app.jobId === Number(id));
      if (found) setApplied(true);
    } catch (err) {
      // ignore
    }
  };

  const fetchAtsScore = async () => {
    setAtsLoading(true);
    try {
      const res = await axiosClient.get(`/resume/ats-check/${id}`);
      setAtsData(res.data);
    } catch (err) {
      // User may not have uploaded a resume yet
      setAtsData(null);
    } finally {
      setAtsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await axiosClient.post(`/applications/apply/${id}`, { notes: applicationNotes });
      setApplied(true);
      alert('Congratulations! Your job application was submitted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading job specifications...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="main-content" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Job Posting Not Found</h2>
        <Link to="/jobs" className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to Open Jobs
        </Link>
      </div>
    );
  }

  const skills = job.requiredSkills ? job.requiredSkills.split(',').map(s => s.trim()) : [];

  return (
    <div className="main-content" style={{ padding: '40px 20px' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Job Search
        </Link>

        {/* Main Grid: Left Details, Right ATS & Apply Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '30px', alignItems: 'start' }}>
          {/* Job Overview */}
          <div>
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{job.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 600 }}>
                      <Building2 size={16} color="var(--primary-light)" /> {job.company}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} /> {job.location}
                    </span>
                  </div>
                </div>
                <span className="badge badge-neutral" style={{ padding: '6px 14px' }}>
                  {job.jobType ? job.jobType.replace('_', ' ') : 'FULL TIME'}
                </span>
              </div>

              {/* Badges Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '16px 0',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '24px',
                fontSize: '0.9rem'
              }}>
                {job.salary && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 600 }}>
                    <DollarSign size={16} /> {job.salary}
                  </div>
                )}
                {job.experience && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Clock size={16} color="#ec4899" /> {job.experience} Required
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)' }}>
                  <Calendar size={16} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', color: '#fff' }}>Role Description</h3>
                <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {job.description}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', color: '#fff' }}>Target Competencies &amp; Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: ATS Match + Apply Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Live ATS Match Card */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
                <Sparkles size={16} /> ATS Match Verification
              </div>

              {atsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  Analyzing resume keywords...
                </div>
              ) : atsData ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div className="gauge-circle" style={{
                      width: '80px',
                      height: '80px',
                      border: `4px solid ${atsData.score > 80 ? '#10b981' : atsData.score >= 60 ? '#0ea5e9' : atsData.score >= 40 ? '#f59e0b' : '#ef4444'}`,
                      fontSize: '1.4rem'
                    }}>
                      {Math.round(atsData.score)}%
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{atsData.matchLevel}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {atsData.totalMatched} / {atsData.totalRequired} skills matched
                      </div>
                    </div>
                  </div>

                  {/* Matched & Missing Chips */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>MATCHED SKILLS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {atsData.matchedSkills.map((s, idx) => (
                        <span key={idx} className="skill-tag skill-tag-matched" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {atsData.missingSkills.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, marginBottom: '6px' }}>SKILL GAPS:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {atsData.missingSkills.map((s, idx) => (
                          <span key={idx} className="skill-tag skill-tag-missing" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                            ✕ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {atsData.feedbackSummary}
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <FileCheck size={32} color="var(--primary-light)" style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Upload your resume to see your real-time match score and missing keyword analysis for this role.
                  </p>
                  <Link to="/candidate" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Upload Resume in Hub
                  </Link>
                </div>
              )}
            </div>

            {/* Application Submission Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Submit Your Application</h3>
              
              {applied ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle2 size={40} color="#34d399" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>Already Applied</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Your application has been received and is being processed by the hiring team.
                  </p>
                  <Link to="/candidate" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
                    Track Application Status
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label">Note for the Recruiter (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Briefly state why you're a great fit for this position..."
                      value={applicationNotes}
                      onChange={(e) => setApplicationNotes(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    <Send size={16} />
                    <span>{applying ? 'Submitting...' : 'Apply for this Position'}</span>
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px' }}>
                    Your latest uploaded resume and ATS score will be submitted to the recruiter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
