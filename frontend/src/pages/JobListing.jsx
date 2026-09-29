import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Filter, 
  RotateCcw, 
  Briefcase,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import JobCard from '../components/JobCard';
import AtsScoreModal from '../components/AtsScoreModal';
import { useAuth } from '../context/AuthContext';

const JobListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myApplications, setMyApplications] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');

  // ATS Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated && (user?.role === 'CANDIDATE' || user?.role === 'ADMIN')) {
      fetchMyApplications();
    }
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = searchParams.get('search') || '';
      const loc = searchParams.get('location') || '';
      const exp = searchParams.get('experience') || '';

      const res = await axiosClient.get('/jobs', {
        params: { search: q, location: loc, experience: exp }
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axiosClient.get('/applications/my-applications');
      setMyApplications(res.data);
    } catch (err) {
      // ignore
    }
  };

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (locationFilter.trim()) params.location = locationFilter.trim();
    if (experienceFilter.trim()) params.experience = experienceFilter.trim();
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setExperienceFilter('');
    setJobTypeFilter('ALL');
    setSearchParams({});
  };

  const handleCheckAts = async (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await axiosClient.get(`/resume/ats-check/${job.id}`);
      setSelectedJob(job);
      setAtsResult(res.data);
      setModalOpen(true);
    } catch (err) {
      if (err.response?.status === 400) {
        alert('Please upload your resume first in Candidate Hub to run ATS scoring!');
        navigate('/candidate');
      } else {
        alert('Could not compute ATS score. Please make sure your resume is uploaded.');
      }
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await axiosClient.post(`/applications/apply/${jobId}`);
      alert('Application submitted successfully!');
      fetchMyApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit application');
    }
  };

  const isJobApplied = (jobId) => {
    return myApplications.some(app => app.jobId === jobId);
  };

  const filteredJobs = jobs.filter(job => {
    if (jobTypeFilter === 'ALL') return true;
    return job.jobType === jobTypeFilter;
  });

  return (
    <div className="main-content" style={{ padding: '40px 20px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Explore Technical Roles</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Search open job requisitions, test your resume against ATS filters, and submit applications directly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <form onSubmit={handleFilterSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* Search Keyword */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Search size={14} /> Keyword / Role / Skill
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Java, Spring Boot, React..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Location Filter */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> Location / Remote
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Remote, San Francisco, Austin..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              {/* Experience Filter */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> Experience Level
                </label>
                <select
                  className="form-control"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="">All Experience Levels</option>
                  <option value="1">Entry Level (1-2 Years)</option>
                  <option value="3">Mid Level (3-5 Years)</option>
                  <option value="5">Senior Level (5+ Years)</option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Filter size={16} /> Filter
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-secondary"
                  title="Reset Filters"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Job Type Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginRight: '6px' }}>Type:</span>
              {[
                { label: 'All Types', val: 'ALL' },
                { label: 'Full Time', val: 'FULL_TIME' },
                { label: 'Remote', val: 'REMOTE' },
                { label: 'Part Time', val: 'PART_TIME' },
                { label: 'Contract', val: 'CONTRACT' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => setJobTypeFilter(tab.val)}
                  className={`btn btn-sm ${jobTypeFilter === tab.val ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredJobs.length}</strong> matching career opportunities
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Loading job postings...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Briefcase size={40} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No matching jobs found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Try broadening your search keywords or resetting filters.</p>
            <button onClick={handleResetFilters} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onCheckAts={handleCheckAts}
                onApply={handleApply}
                isApplied={isJobApplied(job.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ATS Modal */}
      {selectedJob && atsResult && (
        <AtsScoreModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          atsData={atsResult}
          jobTitle={selectedJob.title}
          company={selectedJob.company}
          onApply={() => handleApply(selectedJob.id)}
          isAlreadyApplied={isJobApplied(selectedJob.id)}
        />
      )}
    </div>
  );
};

export default JobListing;
