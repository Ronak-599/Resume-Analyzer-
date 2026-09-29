import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Download, 
  Building2, 
  Clock, 
  Briefcase,
  User,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
  const { user } = useAuth();

  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  // Simulator state
  const [selectedSimJobId, setSelectedSimJobId] = useState('');
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    fetchResume();
    fetchApplications();
    fetchJobs();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axiosClient.get('/resume/my-resume');
      if (res.status === 200 && res.data) {
        setResume(res.data);
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axiosClient.get('/applications/my-applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axiosClient.get('/jobs');
      setJobs(res.data);
      if (res.data.length > 0) {
        setSelectedSimJobId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess('');
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosClient.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResume(res.data);
      setUploadSuccess(`Successfully parsed ${res.data.originalFileName}! Skills and details extracted.`);
      // Refresh applications to update scores if applicable
      fetchApplications();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Error uploading and parsing resume');
    } finally {
      setUploading(false);
    }
  };

  const runAtsSimulator = async () => {
    if (!selectedSimJobId) return;
    setSimLoading(true);
    try {
      const res = await axiosClient.get(`/resume/ats-check/${selectedSimJobId}`);
      setSimResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Please upload a resume first to run simulation');
    } finally {
      setSimLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED': return <span className="badge status-applied">Applied</span>;
      case 'SHORTLISTED': return <span className="badge status-shortlisted">Shortlisted</span>;
      case 'INTERVIEW': return <span className="badge status-interview">Interview Scheduled</span>;
      case 'SELECTED': return <span className="badge status-selected">Selected / Hired</span>;
      case 'REJECTED': return <span className="badge status-rejected">Not Selected</span>;
      default: return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="main-content" style={{ padding: '40px 20px' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <User size={16} /> Candidate Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome back, {user?.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your resume profile, inspect ATS skill matches, and track active job applications.
          </p>
        </div>

        {/* Top Section: Resume Upload & Parsing Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          {/* Resume Upload Dropzone */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={20} color="var(--primary-light)" /> Upload &amp; Parse Resume
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Supported: PDF, DOCX (Apache PDFBox &amp; Apache POI automated extraction)
            </p>

            <label className="dropzone" style={{ display: 'block' }}>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                  <UploadCloud size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                    {uploading ? 'Processing & Parsing Document...' : 'Click to Browse or Drag & Drop'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    PDF, DOCX up to 25MB
                  </div>
                </div>
              </div>
            </label>

            {uploadSuccess && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> {uploadSuccess}
              </div>
            )}

            {uploadError && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}
          </div>

          {/* Parsed Resume Overview */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#ec4899" /> Current Resume Profile
              </h3>
              {resume && (
                <span className="badge badge-excellent">
                  ATS Ready: {Math.round(resume.atsScore || 85)}%
                </span>
              )}
            </div>

            {resume ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <User size={15} color="var(--primary-light)" />
                    <span style={{ color: '#fff', fontWeight: 600 }}>{resume.extractedName || user?.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Mail size={15} color="var(--primary-light)" />
                    <span style={{ color: '#fff' }}>{resume.extractedEmail || user?.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Phone size={15} color="var(--primary-light)" />
                    <span style={{ color: '#fff' }}>{resume.extractedPhone || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <GraduationCap size={15} color="var(--primary-light)" />
                    <span style={{ color: '#fff' }}>{resume.extractedEducation || 'Degree Extracted'}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 700 }}>
                    Extracted Competencies ({resume.skillList?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {resume.skillList && resume.skillList.length > 0 ? (
                      resume.skillList.map((skill, i) => (
                        <span key={i} className="skill-tag skill-tag-matched">✓ {skill}</span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Skills parsing in progress</span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  File: {resume.originalFileName} • Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '12px' }}>No resume uploaded yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Upload a PDF or DOCX file to see your extracted skills and calculate match scores against open jobs.</p>
              </div>
            )}
          </div>
        </div>

        {/* ATS Match Simulator Module */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Sparkles size={16} /> Module 4 • Real-Time ATS Scoring Simulator
              </div>
              <h2 style={{ fontSize: '1.5rem', marginTop: '4px' }}>Simulate Your ATS Match Against Open Roles</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                className="form-control"
                value={selectedSimJobId}
                onChange={(e) => setSelectedSimJobId(e.target.value)}
                style={{ width: '280px' }}
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
              <button
                onClick={runAtsSimulator}
                disabled={simLoading || !resume}
                className="btn btn-primary"
              >
                <TrendingUp size={16} />
                <span>{simLoading ? 'Calculating...' : 'Run ATS Match'}</span>
              </button>
            </div>
          </div>

          {/* Simulator Results Breakdown */}
          {simResult && (
            <div style={{
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div className="gauge-circle" style={{
                  width: '90px',
                  height: '90px',
                  border: `5px solid ${simResult.score > 80 ? '#10b981' : simResult.score >= 60 ? '#0ea5e9' : simResult.score >= 40 ? '#f59e0b' : '#ef4444'}`,
                  fontSize: '1.6rem'
                }}>
                  {Math.round(simResult.score)}%
                </div>
                <div>
                  <span className={`badge ${simResult.score > 80 ? 'badge-excellent' : simResult.score >= 60 ? 'badge-good' : simResult.score >= 40 ? 'badge-average' : 'badge-poor'}`} style={{ fontSize: '0.85rem' }}>
                    {simResult.matchLevel}
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                    {simResult.feedbackSummary}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {simResult.totalMatched} of {simResult.totalRequired} required skills aligned with candidate resume.
                  </div>
                </div>
              </div>

              {/* Matched vs Missing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, marginBottom: '8px' }}>Matched Technical Keywords:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {simResult.matchedSkills.map((s, i) => (
                      <span key={i} className="skill-tag skill-tag-matched">✓ {s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 700, marginBottom: '8px' }}>Missing Prerequisites (Skill Gap):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {simResult.missingSkills.length > 0 ? (
                      simResult.missingSkills.map((s, i) => (
                        <span key={i} className="skill-tag skill-tag-missing">✕ {s}</span>
                      ))
                    ) : (
                      <span style={{ color: '#34d399', fontSize: '0.85rem' }}>All required skills matched!</span>
                    )}
                  </div>
                </div>
              </div>

              {simResult.recommendations && (
                <div style={{ fontSize: '0.85rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Recommendation:</strong> {simResult.recommendations.join(' • ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* My Applications Section */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={22} color="var(--primary-light)" /> My Job Applications ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <p>You haven't submitted any job applications yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Position &amp; Company</th>
                    <th style={{ padding: '12px 16px' }}>Location</th>
                    <th style={{ padding: '12px 16px' }}>ATS Match</th>
                    <th style={{ padding: '12px 16px' }}>Application Status</th>
                    <th style={{ padding: '12px 16px' }}>Applied Date</th>
                    <th style={{ padding: '12px 16px' }}>Recruiter Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{app.jobTitle}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.company}</div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{app.location}</td>
                      <td style={{ padding: '16px' }}>
                        {app.matchScore != null ? (
                          <span className={`badge ${app.matchScore > 80 ? 'badge-excellent' : app.matchScore >= 60 ? 'badge-good' : 'badge-average'}`}>
                            {Math.round(app.matchScore)}%
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {getStatusBadge(app.status)}
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                        {app.notes || 'Under review'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
