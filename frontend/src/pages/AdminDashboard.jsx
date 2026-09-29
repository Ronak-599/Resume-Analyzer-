import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  UserCheck, 
  UserX,
  Server,
  Layers,
  Database
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosClient.get('/admin/stats'),
        axiosClient.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await axiosClient.patch(`/admin/users/${userId}/toggle-status`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting as admin?')) return;
    try {
      await axiosClient.delete(`/admin/jobs/${jobId}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job');
    }
  };

  return (
    <div className="main-content" style={{ padding: '40px 20px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <ShieldCheck size={16} /> Super Admin Control Console
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Portal Administration</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Supervise user accounts, monitor system health, moderate job postings, and review recruitment KPIs.
          </p>
        </div>

        {/* Global Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {[
            { label: 'Total Registered Users', count: stats?.totalUsers || 0, icon: Users, color: '#818cf8' },
            { label: 'Active Candidates', count: stats?.totalCandidates || 0, icon: UserCheck, color: '#38bdf8' },
            { label: 'Verified Recruiters', count: stats?.totalRecruiters || 0, icon: Layers, color: '#f472b6' },
            { label: 'Total Jobs Published', count: stats?.totalJobs || 0, icon: Briefcase, color: '#34d399' },
            { label: 'Applications Filed', count: stats?.totalApplications || 0, icon: FileText, color: '#fbbf24' },
          ].map((item, i) => (
            <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: `${item.color}15`,
                border: `1px solid ${item.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color
              }}>
                <item.icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{item.count}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* User Account Management Table */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={22} color="var(--primary-light)" /> User Account Management ({users.length})
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px' }}>User</th>
                  <th style={{ padding: '12px 14px' }}>Email</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px' }}>Company / Org</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Registered</th>
                  <th style={{ padding: '12px 14px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#fff' }}>{u.name}</td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${
                        u.role === 'ADMIN' ? 'badge-excellent' :
                        u.role === 'RECRUITER' ? 'badge-good' : 'badge-neutral'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{u.companyName || '—'}</td>
                    <td style={{ padding: '14px' }}>
                      {u.enabled ? (
                        <span className="badge badge-excellent">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="badge badge-poor">
                          <XCircle size={12} /> Disabled
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`btn btn-sm ${u.enabled ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {u.enabled ? (
                          <>
                            <UserX size={14} color="#f87171" />
                            <span>Disable</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} color="#34d399" />
                            <span>Enable</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Moderation Table */}
        {stats?.recentJobs && stats.recentJobs.length > 0 && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={22} color="#ec4899" /> Recent Job Postings Moderation
              </h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Title &amp; Company</th>
                    <th style={{ padding: '12px 14px' }}>Location</th>
                    <th style={{ padding: '12px 14px' }}>Recruiter</th>
                    <th style={{ padding: '12px 14px' }}>Applicants</th>
                    <th style={{ padding: '12px 14px' }}>Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentJobs.map((job) => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{job.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.company}</div>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{job.location}</td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{job.recruiterName}</td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-neutral">{job.applicantCount} applicants</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="btn btn-danger btn-sm"
                          title="Remove posting"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
