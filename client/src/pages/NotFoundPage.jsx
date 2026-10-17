import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-2xl mb-4 shadow-sm">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 mb-8 leading-relaxed">
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
        >
          <Search className="w-4 h-4" /> Browse Opportunities
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
