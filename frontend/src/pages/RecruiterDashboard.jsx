import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Building, 
  Filter, 
  Eye, 
  Check,
  BarChart3,
  PieChart
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


const RecruiterDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Job Modal state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    company: user?.companyName || 'TechCorp Innovations',
    location: '',
    salary: '',
    experience: '',
    requiredSkills: '',
    jobType: 'FULL_TIME'
  });

  // Filter applicants by job
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, appsRes] = await Promise.all([
        axiosClient.get('/stats/recruiter'),
        axiosClient.get('/jobs/my-jobs'),
        axiosClient.get('/applications/recruiter-all')
      ]);
      setStats(statsRes.data);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPostModal = (jobToEdit = null) => {
    if (jobToEdit) {
      setEditingJobId(jobToEdit.id);
      setJobForm({
        title: jobToEdit.title,
        description: jobToEdit.description,
        company: jobToEdit.company,
        location: jobToEdit.location,
        salary: jobToEdit.salary || '',
        experience: jobToEdit.experience || '',
        requiredSkills: jobToEdit.requiredSkills,
        jobType: jobToEdit.jobType || 'FULL_TIME'
      });
    } else {
      setEditingJobId(null);
      setJobForm({
        title: '',
        description: '',
        company: user?.companyName || 'TechCorp Innovations',
        location: 'San Francisco, CA (Hybrid)',
        salary: '$110,000 - $140,000',
        experience: '3+ Years',
        requiredSkills: 'Java, Spring Boot, React, MySQL, Docker, REST API',
        jobType: 'FULL_TIME'
      });
    }
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await axiosClient.put(`/jobs/${editingJobId}`, jobForm);
        alert('Job requisition updated successfully!');
      } else {
        await axiosClient.post('/jobs', jobForm);
        alert('New job posted successfully!');
      }
      setJobModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await axiosClient.delete(`/jobs/${jobId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job');
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axiosClient.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
        notes: `Status updated to ${newStatus} by ${user?.name}`
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update candidate status');
    }
  };

  const handleDownloadResume = (resumeId, candidateName) => {
    if (!resumeId) {
      alert('No resume attached to this application');
      return;
    }
    window.open(`http://localhost:8080/api/resume/download/${resumeId}`, '_blank');
  };

  const filteredApplications = selectedJobFilter === 'ALL'
    ? applications
    : applications.filter(app => app.jobId === Number(selectedJobFilter));

  return (
    <div className="main-content" style={{ padding: '40px 20px' }}>
      <div className="container">
        {/* Header with Post Job Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Building size={16} /> Recruiter Hub &amp; ATS Pipeline
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '4px' }}>Hiring Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Managing talent pipeline for <strong style={{ color: '#fff' }}>{user?.companyName || 'TechCorp'}</strong>
            </p>
          </div>

          <button onClick={() => handleOpenPostModal()} className="btn btn-primary btn-lg">
            <Plus size={18} />
            <span>Post New Job Requisition</span>
          </button>
        </div>

        {/* Stats Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Jobs Posted', count: stats?.jobsPosted || 0, icon: Briefcase, color: '#818cf8' },
            { label: 'Applications', count: stats?.applicationsReceived || 0, icon: Users, color: '#38bdf8' },
            { label: 'Shortlisted', count: stats?.shortlistedCount || 0, icon: Sparkles, color: '#a78bfa' },
            { label: 'Interviews', count: stats?.interviewCount || 0, icon: Clock, color: '#fbbf24' },
            { label: 'Selected / Hired', count: stats?.selectedCount || 0, icon: CheckCircle2, color: '#34d399' },
            { label: 'Rejected', count: stats?.rejectedCount || 0, icon: XCircle, color: '#f87171' },
          ].map((item, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: `${item.color}15`,
                border: `1px solid ${item.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color
              }}>
                <item.icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{item.count}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Module 8: Chart.js Analytics Visualizations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {/* Bar Chart: Application Funnel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="var(--primary-light)" /> Application Stages Funnel
              </h3>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Chart.js Bar</span>
            </div>
            <div style={{ height: '220px' }}>
              <Bar
                data={{
                  labels: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
                  datasets: [
                    {
                      label: 'Candidate Count',
                      data: [
                        stats?.applicationsReceived || 1,
                        stats?.shortlistedCount || 1,
                        stats?.interviewCount || 0,
                        stats?.selectedCount || 0,
                        stats?.rejectedCount || 0,
                      ],
                      backgroundColor: [
                        'rgba(14, 165, 233, 0.75)',
                        'rgba(129, 140, 248, 0.75)',
                        'rgba(245, 158, 11, 0.75)',
                        'rgba(16, 185, 129, 0.75)',
                        'rgba(239, 68, 68, 0.75)',
                      ],
                      borderColor: [
                        '#0ea5e9',
                        '#818cf8',
                        '#f59e0b',
                        '#10b981',
                        '#ef4444',
                      ],
                      borderWidth: 1,
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: '#111827',
                      titleColor: '#fff',
                      bodyColor: '#cbd5e1',
                    },
                  },
                  scales: {
                    x: {
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#94a3b8' },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#94a3b8', stepSize: 1 },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Doughnut / Pie Chart: Hiring Decision Ratio */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={18} color="#ec4899" /> Candidate Decision Distribution
              </h3>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Chart.js Doughnut</span>
            </div>
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={{
                  labels: ['Selected / Offer', 'Shortlisted', 'Interviewing', 'Active Review', 'Rejected'],
                  datasets: [
                    {
                      data: [
                        stats?.selectedCount || 0,
                        stats?.shortlistedCount || 1,
                        stats?.interviewCount || 0,
                        Math.max(0, (stats?.applicationsReceived || 1) - (stats?.shortlistedCount || 0) - (stats?.selectedCount || 0) - (stats?.rejectedCount || 0)),
                        stats?.rejectedCount || 0,
                      ],
                      backgroundColor: [
                        '#10b981',
                        '#818cf8',
                        '#f59e0b',
                        '#0ea5e9',
                        '#ef4444',
                      ],
                      borderColor: '#111726',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: '#cbd5e1', font: { size: 11 }, boxWidth: 12 },
                    },
                    tooltip: {
                      backgroundColor: '#111827',
                      titleColor: '#fff',
                      bodyColor: '#cbd5e1',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Candidate ATS Pipeline & Review Section */}

        <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={22} color="var(--primary-light)" /> Candidate Pipeline &amp; ATS Score Ranking
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Screen candidates ranked by automated ATS skill match percentage.
              </p>
            </div>

            {/* Filter by Job */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="form-control"
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                style={{ width: '240px', padding: '6px 12px' }}
              >
                <option value="ALL">All Jobs ({applications.length} Applicants)</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              No candidate applications received for this selection yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Candidate</th>
                    <th style={{ padding: '12px 14px' }}>Position</th>
                    <th style={{ padding: '12px 14px' }}>ATS Match</th>
                    <th style={{ padding: '12px 14px' }}>Resume</th>
                    <th style={{ padding: '12px 14px' }}>Workflow Stage</th>
                    <th style={{ padding: '12px 14px' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{app.candidateName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.candidateEmail}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#cbd5e1' }}>
                        {app.jobTitle}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {app.matchScore != null ? (
                          <span className={`badge ${app.matchScore > 80 ? 'badge-excellent' : app.matchScore >= 60 ? 'badge-good' : app.matchScore >= 40 ? 'badge-average' : 'badge-poor'}`}>
                            {Math.round(app.matchScore)}% Match
                          </span>
                        ) : (
                          <span className="badge badge-neutral">N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {app.resumeId ? (
                          <button
                            onClick={() => handleDownloadResume(app.resumeId, app.candidateName)}
                            className="btn btn-secondary btn-sm"
                            title="Download Candidate Resume"
                          >
                            <Download size={14} color="var(--primary-light)" />
                            <span>Resume</span>
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No file</span>
                        )}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${
                          app.status === 'SELECTED' ? 'status-selected' :
                          app.status === 'SHORTLISTED' ? 'status-shortlisted' :
                          app.status === 'INTERVIEW' ? 'status-interview' :
                          app.status === 'REJECTED' ? 'status-rejected' : 'status-applied'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <select
                          className="form-control"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlist Candidate</option>
                          <option value="INTERVIEW">Invite for Interview</option>
                          <option value="SELECTED">Select / Offer</option>
                          <option value="REJECTED">Reject Candidate</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manage My Posted Jobs */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={22} color="#ec4899" /> Active Job Requisitions ({jobs.length})
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              You haven't posted any jobs yet. Click "Post New Job Requisition" to create one.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Title &amp; Location</th>
                    <th style={{ padding: '12px 14px' }}>Salary</th>
                    <th style={{ padding: '12px 14px' }}>Required Skills</th>
                    <th style={{ padding: '12px 14px' }}>Applicants</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{j.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{j.location} • {j.jobType}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#34d399' }}>{j.salary || 'Competitive'}</td>
                      <td style={{ padding: '14px', maxWidth: '300px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {j.requiredSkills}
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-good">{j.applicantCount} applied</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenPostModal(j)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Job"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(j.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Job"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Post / Edit Job Modal */}
      {jobModalOpen && (
        <div className="modal-overlay" onClick={() => setJobModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
              {editingJobId ? 'Edit Job Requisition' : 'Post New Job Requisition'}
            </h3>

            <form onSubmit={handleSaveJob}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Senior Java Full Stack Developer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Remote or San Francisco, CA"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. $120k - $140k"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 3+ Years"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select
                    className="form-control"
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="REMOTE">Remote</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma-separated for ATS matching) *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Java, Spring Boot, React, MySQL, Docker, Kubernetes"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  The ATS Engine matches applicant resumes against these exact keywords.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Job Description *</label>
                <textarea
                  required
                  rows="4"
                  className="form-control"
                  placeholder="Describe day-to-day responsibilities, stack requirements, and qualifications..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setJobModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingJobId ? 'Save Changes' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
