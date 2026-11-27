import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  LogOut,
  Menu,
  X,
  Shield,
  PlusCircle,
  LayoutDashboard,
  ChevronDown,
  Settings,
  User as UserIcon,
  Bookmark,
  FileText
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isRecruiter, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/student/dashboard';
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium whitespace-nowrap transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-brand-700 bg-brand-50'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-semibold'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">JobPortal</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
            <NavLink to="/internships" className={navLinkClass}>Internships</NavLink>
            <NavLink to="/companies" className={navLinkClass}>Companies</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            {isStudent && (
              <NavLink to="/student/dashboard" className={navLinkClass}>Dashboard</NavLink>
            )}
            {isRecruiter && (
              <NavLink to="/recruiter/dashboard" className={navLinkClass}>Recruiter Hub</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Console</NavLink>
            )}
          </nav>

          {/* Right Section: Auth State / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isRecruiter && (
                  <Link
                    to="/recruiter/dashboard?action=new-job"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post a Job</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left max-w-[140px]">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[10px] font-medium text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                          {user?.role} account
                        </span>
                      </div>

                      <div className="py-1.5">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                        >
                          {isAdmin ? <Shield className="w-4 h-4 text-amber-600" /> : <LayoutDashboard className="w-4 h-4 text-slate-400" />}
                          <span>Dashboard</span>
                        </Link>

                        {isStudent && (
                          <>
                            <Link
                              to="/student/dashboard?tab=applications"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                            >
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span>My Applications</span>
                            </Link>
                            <Link
                              to="/student/dashboard?tab=saved"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                            >
                              <Bookmark className="w-4 h-4 text-slate-400" />
                              <span>Saved Jobs</span>
                            </Link>
                            <Link
                              to="/student/dashboard?tab=profile"
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                            >
                              <UserIcon className="w-4 h-4 text-slate-400" />
                              <span>Profile</span>
                            </Link>
                          </>
                        )}

                        <Link
                          to={`${getDashboardPath()}?tab=settings`}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
            Home
          </NavLink>
          <NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
            Jobs
          </NavLink>
          <NavLink to="/internships" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
            Internships
          </NavLink>
          <NavLink to="/companies" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
            Companies
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
            Contact
          </NavLink>

          <div className="pt-3 mt-2 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3.5 py-2 bg-slate-50 rounded-xl">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-brand-700 font-medium capitalize">{user?.role} account</p>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl"
                >
                  Open Dashboard
                </Link>
                <Link
                  to={`${getDashboardPath()}?tab=settings`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl"
                >
                  Account Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-slate-700 border border-slate-300 text-sm font-semibold rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-xs"
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
