import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Users, 
  ChevronRight,
  Code2
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import JobCard from '../components/JobCard';
import AtsScoreModal from '../components/AtsScoreModal';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ATS Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await axiosClient.get('/jobs');
      setFeaturedJobs(res.data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
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
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit application');
    }
  };

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '70px 20px 80px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span>AI-Driven ATS Engine &amp; Career Matching Platform</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            marginBottom: '20px',
            lineHeight: 1.15
          }}>
            Beat the ATS Filter with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Intelligent Scoring
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '36px',
            maxWidth: '720px',
            margin: '0 auto 36px'
          }}>
            Upload your resume in PDF or DOCX format to receive an instant ATS score, identify missing technical keywords, and match with verified recruiters.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '6px 8px 6px 20px',
            maxWidth: '680px',
            margin: '0 auto 28px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <Search size={22} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '12px' }} />
            <input
              type="text"
              placeholder="Search by role or skill (e.g. Java, Spring Boot, React, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'var(--font-main)'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-lg)' }}>
              Find Jobs
            </button>
          </form>

          {/* Popular Tag Filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Trending Searches:</span>
            {['Java Full Stack', 'Spring Boot', 'React', 'Microservices', 'DevOps', 'MySQL'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="skill-tag"
                style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.04)' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ padding: '0 20px 60px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {[
              { label: 'Scoring Formula', val: 'Match / Req * 100', desc: 'Precise skill alignment', icon: Cpu, color: '#818cf8' },
              { label: 'Supported Formats', val: 'PDF & DOCX', desc: 'Apache PDFBox & POI', icon: FileText, color: '#ec4899' },
              { label: 'Authentication', val: 'Stateless JWT', desc: 'Spring Security 6', icon: ShieldCheck, color: '#10b981' },
              { label: 'Live Database', val: 'MySQL & H2', desc: 'JPA / Hibernate ORM', icon: Layers, color: '#38bdf8' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  flexShrink: 0
                }}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the ATS Engine Works */}
      <section style={{ padding: '40px 20px 70px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
            <span className="badge badge-good" style={{ marginBottom: '10px' }}>MODULE 4 ARCHITECTURE</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>How the ATS Engine Analyzes Your Resume</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Our multi-stage parsing engine extracts metadata, tokenizes competencies, and matches candidate resumes against recruiter criteria in real-time.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                step: '01',
                title: 'Multi-Format Parsing',
                desc: 'Upload PDF or DOCX. Apache PDFBox and Apache POI extract raw text, candidate contact info, and education degrees with zero data loss.',
                badge: 'PDFBox + POI'
              },
              {
                step: '02',
                title: 'Skill & Entity Extraction',
                desc: 'Text is parsed against a 100+ industry skill taxonomy (Java 21, Spring Boot, React, Docker, Kubernetes) with synonym normalization.',
                badge: 'Regex + Dictionary'
              },
              {
                step: '03',
                title: 'Algorithmic ATS Scoring',
                desc: 'Applies (Matched Skills / Required Skills * 100) and categorizes candidates into Excellent (>80%), Good, Average, and Poor matches.',
                badge: 'Weighted Formula'
              }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(99, 102, 241, 0.2)',
                  lineHeight: 1,
                  marginBottom: '14px'
                }}>
                  {step.step}
                </div>
                <div style={{ display: 'inline-block', marginBottom: '10px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{step.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '20px 20px 80px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Featured Career Opportunities</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Top roles actively seeking talent with real-time ATS match checking</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary">
              <span>View All Open Positions</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onCheckAts={handleCheckAts}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Role Workflows Showcase */}
      <section style={{ padding: '40px 20px 80px', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Built For Every Stakeholder</h2>
            <p style={{ color: 'var(--text-muted)' }}>Engineered to satisfy complete role-based workflows</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Candidate Role */}
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: '20px' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Candidate Portal</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Upload PDF / DOCX resumes</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Instant ATS score generation</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Filter jobs by salary &amp; experience</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Real-time application tracker</li>
              </ul>
              <Link to="/candidate" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Enter Candidate Portal
              </Link>
            </div>

            {/* Recruiter Role */}
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6', marginBottom: '20px' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Recruiter Hub</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Post &amp; edit job openings</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> View applicants with ATS scores</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Download parsed candidate resumes</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Shortlist, Interview, Select, Reject</li>
              </ul>
              <Link to="/recruiter" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Enter Recruiter Hub
              </Link>
            </div>

            {/* Admin Role */}
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: '20px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Admin Console</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Manage user accounts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Enable / disable access instantly</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Moderate and remove spam jobs</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Platform-wide health analytics</li>
              </ul>
              <Link to="/admin" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Enter Admin Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ATS Modal */}
      {selectedJob && atsResult && (
        <AtsScoreModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          atsData={atsResult}
          jobTitle={selectedJob.title}
          company={selectedJob.company}
          onApply={() => handleApply(selectedJob.id)}
        />
      )}
    </div>
  );
};

export default Home;
