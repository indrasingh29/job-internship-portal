import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Laptop,
  Layers,
  ShieldCheck,
  Sparkles,
  Building2,
  UserCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { CardSkeleton } from '../components/SkeletonLoader';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [opportunityMode, setOpportunityMode] = useState('Job');

  const [latestJobs, setLatestJobs] = useState([]);
  const [latestInternships, setLatestInternships] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalInternships: 0,
    totalCompanies: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const navigate = useNavigate();

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [jobsRes, internshipsRes, compsRes, statsRes] = await Promise.all([
        api.get('/jobs?opportunityType=Job&limit=6'),
        api.get('/jobs?opportunityType=Internship&limit=3'),
        api.get('/companies?limit=12'),
        api.get('/stats/public')
      ]);

      if (jobsRes.data.success) setLatestJobs(jobsRes.data.jobs || []);
      if (internshipsRes.data.success) setLatestInternships(internshipsRes.data.jobs || []);
      if (compsRes.data.success) setFeaturedCompanies(compsRes.data.companies || []);
      if (statsRes.data.success) setStats(statsRes.data.stats);
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          'Unable to reach the opportunities service right now. Please try again shortly.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const baseRoute = opportunityMode === 'Internship' ? '/internships' : '/jobs';
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (locationTerm.trim()) params.append('location', locationTerm.trim());
    const qs = params.toString();
    navigate(qs ? `${baseRoute}?${qs}` : baseRoute);
  };

  const categories = [
    { title: 'Software Engineering', subtitle: 'Core & full-stack roles', icon: Layers, query: 'Software Engineering' },
    { title: 'Frontend Development', subtitle: 'React, TypeScript & UI', icon: Laptop, query: 'Frontend Development' },
    { title: 'Backend Development', subtitle: 'APIs, Node.js & databases', icon: Briefcase, query: 'Backend Development' },
    { title: 'Data & AI', subtitle: 'ML, analytics & data engineering', icon: TrendingUp, query: 'Data & AI' },
    { title: 'Cloud & DevOps', subtitle: 'AWS, Azure & Kubernetes', icon: Sparkles, query: 'Cloud & DevOps' },
    { title: 'QA & Testing', subtitle: 'Automation & quality assurance', icon: CheckCircle2, query: 'QA & Testing' }
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200/70 pt-14 pb-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Find Your Next{' '}
              <span className="text-brand-600">Tech Job or Internship</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore verified roles across top technology companies and fast-growing teams. Built for students, fresh graduates, and software professionals.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
            >
              <div className="md:col-span-5 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/70 md:bg-transparent">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  aria-label="Job title, skill, or company"
                  placeholder="Job title, skill, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/70 md:bg-transparent md:border-l md:border-slate-200">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  aria-label="Location"
                  placeholder="City or Remote"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 md:border-l md:border-slate-200 px-2">
                <select
                  aria-label="Opportunity type"
                  value={opportunityMode}
                  onChange={(e) => setOpportunityMode(e.target.value)}
                  className="w-full text-sm font-medium text-slate-700 bg-transparent py-2 focus:outline-none"
                >
                  <option value="Job">Jobs</option>
                  <option value="Internship">Internships</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Primary Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Browse Jobs
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold rounded-xl transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-brand-600" />
                Browse Internships
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Strip (Live DB Metrics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-2 md:pt-0">
            <p className="text-3xl font-extrabold text-white">{stats.totalJobs}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Active Full-Time &amp; Tech Jobs</p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="text-3xl font-extrabold text-brand-400">{stats.totalInternships}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Open Internships</p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="text-3xl font-extrabold text-white">{stats.totalCompanies}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Hiring Companies</p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="text-3xl font-extrabold text-brand-400">{stats.totalApplications}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Applications Submitted</p>
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Explore opportunities by engineering specialization</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
            All roles <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={`/jobs?category=${encodeURIComponent(cat.query)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-brand-300 hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-sm truncate">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{cat.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Jobs</h2>
            <p className="text-sm text-slate-500 mt-1">Recently published full-time and entry-level opportunities</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
            View all jobs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">{loadError}</p>
            <button
              type="button"
              onClick={loadHomeData}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        ) : latestJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            No active job postings available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <OpportunityCard key={job._id} opportunity={job} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Internships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Internships</h2>
            <p className="text-sm text-slate-500 mt-1">Hands-on internships for students and fresh graduates</p>
          </div>
          <Link to="/internships" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
            View all internships <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">{loadError}</p>
            <button
              type="button"
              onClick={loadHomeData}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        ) : latestInternships.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            No active internship postings available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestInternships.map((internship) => (
              <OpportunityCard key={internship._id} opportunity={internship} />
            ))}
          </div>
        )}
      </section>

      {/* Companies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Hiring Companies</h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore company profiles, engineering teams, and open positions
              </p>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
            >
              View All Companies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : loadError ? (
            <div className="bg-slate-50 rounded-2xl border border-amber-200 p-6 text-center space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">{loadError}</p>
              <button
                type="button"
                onClick={loadHomeData}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : featuredCompanies.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No company profiles available right now.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {featuredCompanies.map((comp) => (
                <Link
                  key={comp._id}
                  to={`/company/${comp.slug || comp._id}`}
                  className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-brand-300 hover:bg-white hover:shadow-sm transition-all text-center flex flex-col items-center justify-center group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 group-hover:bg-brand-50 group-hover:border-brand-200 text-slate-800 group-hover:text-brand-700 font-bold flex items-center justify-center text-sm transition-colors mb-2">
                    {comp.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{comp.industry}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Platform Highlights & How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How JobPortal Works</h2>
          <p className="text-sm text-slate-500 mt-2">
            A streamlined hiring workflow for candidates and recruiting teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Discover Roles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter active jobs and internships by location, remote/hybrid workplace mode, skills, compensation, and fresher eligibility.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Apply With One Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Keep your skills, education, and resume link ready in your student profile, bookmark roles, and submit tailored applications.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Track Progress</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitor application statuses in real time while recruiters manage postings, review resumes, and shortlist candidates.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to take the next step in your career?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create an account to apply for jobs and internships, or register as an employer to publish open roles and review applicants.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-colors inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=recruiter"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
