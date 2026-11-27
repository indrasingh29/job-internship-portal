import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Users,
  Search
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          About JobPortal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connecting Emerging Tech Talent with Great Teams
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          JobPortal is a dedicated job and internship discovery platform built to help students, fresh graduates, and software professionals find meaningful opportunities with transparency and speed.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Focused Discovery</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Search across full-time roles and internships with clear filters for workplace mode, required skills, compensation, and fresher eligibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Built for Employers</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recruiters can publish roles, manage company profiles, track applicant pipelines, and update candidate statuses from one centralized workspace.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Security &amp; Integrity</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Role-based access controls, hashed credentials, and duplicate-application protections ensure reliable workflows for candidates and hiring teams.
          </p>
        </div>
      </div>

      {/* For Candidates & For Employers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900">For Students &amp; Job Seekers</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Browse verified tech jobs and paid internships without clutter.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Bookmark roles to review later and apply with your saved profile and resume link.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Track every application status from submission to shortlisting and selection.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900">For Recruiters &amp; Hiring Teams</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Publish, edit, close, or reopen job and internship listings anytime.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Review candidate profiles, skills, cover notes, and resumes in one place.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Shortlist, select, or reject applicants with clear hiring pipeline analytics.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold">Start exploring opportunities today</h3>
          <p className="text-xs text-slate-300">
            Browse active listings or sign up to create your candidate or employer account.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
