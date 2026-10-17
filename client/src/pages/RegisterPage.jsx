import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Lock,
  Mail,
  User,
  Building2,
  AlertCircle,
  UserCheck,
  GraduationCap
} from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Information Technology');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'recruiter' ? { companyName, industry } : {})
      };

      const res = await register(payload);
      if (res?.user?.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs text-slate-500">
          Join as a student to apply, or as a recruiter to hire talent.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl shadow-brand-500/5 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'recruiter'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Recruiter / Employer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Indra Singh Jeena"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs text-slate-800 pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-800 pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password (min 6 characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs text-slate-800 pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Recruiter specific inputs */}
            {role === 'recruiter' && (
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <p className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Organization Details
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Startup Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Solutions"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs text-slate-800 px-3.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    placeholder="e.g. FinTech, Cloud, E-Commerce"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full text-xs text-slate-800 px-3.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              {loading ? 'Creating Account...' : `Register as ${role === 'student' ? 'Student' : 'Recruiter'}`}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
