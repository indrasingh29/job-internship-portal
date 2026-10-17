import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Laptop,
  Layers
} from 'lucide-react';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { CardSkeleton } from '../components/SkeletonLoader';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalInternships: 0, totalCompanies: 50, totalApplications: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsRes, compsRes, statsRes] = await Promise.all([
          api.get('/jobs?limit=6'),
          api.get('/companies?limit=12'),
          api.get('/stats/public')
        ]);

        if (jobsRes.data.success) setFeaturedJobs(jobsRes.data.jobs);
        if (compsRes.data.success) setFeaturedCompanies(compsRes.data.companies);
        if (statsRes.data.success) setStats(statsRes.data.stats);
      } catch (err) {
        console.error('Home data load error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const categories = [
    { title: 'Full-Stack Development', count: '14+ Openings', icon: Layers, query: 'Software Engineering' },
    { title: 'Frontend (React/Web)', count: '10+ Openings', icon: Laptop, query: 'Frontend Development' },
    { title: 'Backend & Cloud', count: '12+ Openings', icon: Briefcase, query: 'Backend Development' },
    { title: 'Data Analytics & AI', count: '8+ Openings', icon: TrendingUp, query: 'Data & AI' },
    { title: 'Cloud & DevOps', count: '9+ Openings', icon: Sparkles, query: 'Cloud & DevOps' },
    { title: 'QA & Test Automation', count: '6+ Openings', icon: CheckCircle2, query: 'QA & Testing' }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 border-b border-slate-200/60 pt-16 pb-20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Academic Project Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold shadow-sm border border-brand-200">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>B.Tech CSE Minor Project (2026–27) &bull; Built with MERN Stack</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Launch Your Career with <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Premium Tech Opportunities</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified jobs and high-stipend internships across 50 top MNCs and tech unicorns. Tailored for students, freshers, and software developers.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-brand-500/5 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-3 px-3.5 w-full flex-1">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skill (e.g. React, Node.js, Python), or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 flex-shrink-0"
              >
                Find Opportunities
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-medium">Trending:</span>
              {['MERN Stack', 'Remote', 'Frontend Developer', 'Data Analyst Intern', 'Fresher Eligible'].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                  className="bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 px-2.5 py-1 rounded-full text-slate-600 transition-colors shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Live Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-3 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">50+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Curated Tech Companies</p>
          </div>
          <div className="pt-3 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.totalJobs + stats.totalInternships || '52+'}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Active Opportunities</p>
          </div>
          <div className="pt-3 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Fresher & Student Focus</p>
          </div>
          <div className="pt-3 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-white">MERN</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Cloud Architecture</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Target opportunities in specialized technical domains</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            All categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.query)}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-brand-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-sm">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Featured Openings</h2>
              <span className="text-xs font-semibold bg-brand-100 text-brand-800 px-2 py-0.5 rounded">Handpicked</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">High-demand roles with detailed descriptions and deadlines</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View all ({stats.totalJobs + stats.totalInternships}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <OpportunityCard key={job._id} opportunity={job} />
            ))}
          </div>
        )}
      </section>

      {/* 50-Company Directory Highlight Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                50 Partner Directory Profiles
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Leading Tech Employers & Startups</h2>
              <p className="text-sm text-slate-600 mt-1">
                Explore dedicated profiles for 25 global MNCs, 19 Indian IT leaders, and 6 high-growth startups
              </p>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0"
            >
              Browse All 50 Companies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {featuredCompanies.map((comp) => (
              <Link
                key={comp._id}
                to={`/company/${comp.slug || comp._id}`}
                className="bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-brand-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-brand-50 text-slate-800 group-hover:text-brand-600 font-bold flex items-center justify-center text-sm transition-colors mb-2">
                  {comp.name.charAt(0)}
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">
                  {comp.name}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{comp.industry}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded">Simple & Transparent</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">How The Portal Works</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-1">
            Engineered to streamline the complete hiring lifecycle from discovery to status updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-5">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Explore & Filter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter 50+ opportunities by remote/onsite mode, fresher eligibility, stipend brackets, and skills tags without signup required.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-5">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Submit Application</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log in as a student to apply with your resume URL and customized cover message. Duplicate applications are blocked at the database layer.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-5">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Track & Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students monitor real-time statuses (Applied, Shortlisted, Selected). Recruiters review candidate profiles and post new listings.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Project Presentation Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 bg-brand-800/60 px-3 py-1 rounded-full border border-brand-700">
              B.Tech Computer Science & Engineering
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">Minor Project 2026–27</h2>
            <p className="text-sm text-brand-100 leading-relaxed">
              Designed, architected, and implemented by <strong className="text-white">Indra Singh Jeena</strong>. Built as a comprehensive demonstration of full-stack MERN engineering, role-based JWT security, MongoDB compound indexing, and cloud-native deployment on Render.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="bg-white text-brand-900 hover:bg-brand-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors inline-flex items-center gap-2"
              >
                View Project Architecture
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="bg-brand-800 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-brand-700"
              >
                Explore Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
