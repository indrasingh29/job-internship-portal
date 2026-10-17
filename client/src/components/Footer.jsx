import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Project Identity */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">JobPortal</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A complete, production-minded MERN stack Job & Internship discovery platform built for college project evaluation and portfolio showcase.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-brand-400 border border-slate-700">
                <Code className="w-3.5 h-3.5" /> B.Tech CSE Minor Project
              </span>
            </div>
          </div>

          {/* Column 2: Quick Discovery */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse All Jobs</Link></li>
              <li><Link to="/internships" className="hover:text-white transition-colors">Student Internships</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">50-Company Directory</Link></li>
              <li><Link to="/jobs?isFresherEligible=true" className="hover:text-white transition-colors">Fresher Opportunities</Link></li>
              <li><Link to="/jobs?workplaceType=Remote" className="hover:text-white transition-colors">Remote Positions</Link></li>
            </ul>
          </div>

          {/* Column 3: Portal Roles */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Job Seeker Dashboard</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Recruiter Management</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Administrator Console</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Employer Registration</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">System Architecture</Link></li>
            </ul>
          </div>

          {/* Column 4: Academic Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Academic Details</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="text-slate-200 font-medium">Project Owner:</span> Indra Singh Jeena</li>
              <li><span className="text-slate-200 font-medium">Academic Session:</span> 2026–27</li>
              <li><span className="text-slate-200 font-medium">Degree:</span> B.Tech CSE</li>
              <li><span className="text-slate-200 font-medium">Stack:</span> MongoDB, Express, React, Node</li>
              <li><span className="text-slate-200 font-medium">Hosting:</span> Render + MongoDB Atlas</li>
            </ul>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-300">Academic Project Disclaimer:</strong> This portal is developed solely as an educational B.Tech CSE Minor Project. Company brand names and sample opportunity listings are curated for realistic academic demonstration, testing, and evaluation. No official partnership, endorsement, or live hiring affiliation with the listed companies is implied.
          </p>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-medium text-slate-300">
            &copy; 2026 Indra Singh Jeena. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-200 transition-colors">Architecture</Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">Support & Contact</Link>
            <span>Academic Session 2026–27</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
