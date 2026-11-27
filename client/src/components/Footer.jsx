import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated, isRecruiter, isAdmin } = useAuth();

  const dashboardRoute = isAdmin
    ? '/admin/dashboard'
    : isRecruiter
    ? '/recruiter/dashboard'
    : '/student/dashboard';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-3.5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">JobPortal</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting students, graduates, and experienced professionals with verified tech jobs and internships across leading companies.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Opportunities</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="text-slate-400 hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/internships" className="text-slate-400 hover:text-white transition-colors">Browse Internships</Link></li>
              <li><Link to="/companies" className="text-slate-400 hover:text-white transition-colors">Companies</Link></li>
              <li><Link to="/jobs?isFresherEligible=true" className="text-slate-400 hover:text-white transition-colors">Fresher Roles</Link></li>
              <li><Link to="/jobs?workplaceType=Remote" className="text-slate-400 hover:text-white transition-colors">Remote Opportunities</Link></li>
            </ul>
          </div>

          {/* Accounts */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {isAuthenticated ? (
                <li><Link to={dashboardRoute} className="text-slate-400 hover:text-white transition-colors">My Dashboard</Link></li>
              ) : (
                <>
                  <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
                  <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Create Account</Link></li>
                </>
              )}
              <li><Link to="/register?role=recruiter" className="text-slate-400 hover:text-white transition-colors">For Employers</Link></li>
              <li><Link to="/forgot-password" className="text-slate-400 hover:text-white transition-colors">Reset Password</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About JobPortal</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact &amp; Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/jobs" className="hover:text-white transition-colors">Jobs</Link>
            <Link to="/internships" className="hover:text-white transition-colors">Internships</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
