import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Building2,
  GraduationCap,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  PlusCircle,
  LayoutDashboard,
  Bookmark
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isRecruiter, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-brand-600 bg-brand-50'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">JobPortal</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
                  MERN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">Minor Project 2026–27</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/jobs" className={navLinkClass}>Browse Jobs</NavLink>
            <NavLink to="/internships" className={navLinkClass}>Internships</NavLink>
            <NavLink to="/companies" className={navLinkClass}>Companies</NavLink>
            <NavLink to="/about" className={navLinkClass}>About Project</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>

          {/* Right Section: Auth State / Dashboards */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isStudent && (
                  <Link
                    to="/student/dashboard"
                    className="flex items-center gap-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 px-3.5 py-2 rounded-lg transition-colors border border-brand-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </Link>
                )}

                {isRecruiter && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className="flex items-center gap-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 px-3.5 py-2 rounded-lg transition-colors border border-brand-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Recruiter Panel</span>
                    </Link>
                    <Link
                      to="/recruiter/dashboard?action=new-job"
                      className="flex items-center gap-1 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Job</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 text-sm font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 px-3.5 py-2 rounded-lg transition-colors border border-amber-300"
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Dropdown / Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{user.name}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm shadow-brand-500/20 transition-all hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Browse Jobs
          </NavLink>
          <NavLink
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Internships
          </NavLink>
          <NavLink
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Company Directory
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            About Project
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Contact
          </NavLink>

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-brand-600 font-medium capitalize">{user.role} Account</p>
                </div>
                {isStudent && (
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-brand-50 text-brand-700 font-medium rounded-lg"
                  >
                    Student Dashboard
                  </Link>
                )}
                {isRecruiter && (
                  <Link
                    to="/recruiter/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-brand-50 text-brand-700 font-medium rounded-lg"
                  >
                    Recruiter Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-amber-50 text-amber-800 font-medium rounded-lg"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-slate-700 border border-slate-300 font-medium rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 bg-brand-600 text-white font-medium rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
