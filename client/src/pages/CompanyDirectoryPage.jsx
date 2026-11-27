import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CompanyCard from '../components/CompanyCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Search, Building2, ChevronLeft, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react';

const CompanyDirectoryPage = () => {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [page, setPage] = useState(1);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await api.get('/companies/meta/industries');
        if (res.data.success) {
          setIndustries(res.data.industries || []);
        }
      } catch (err) {
        console.error('Failed to load industries:', err.message);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
        if (industry && industry !== 'All') params.append('industry', industry);
        params.append('page', String(page));
        params.append('limit', '12');

        const res = await api.get(`/companies?${params.toString()}`);
        if (res.data.success) {
          setCompanies(res.data.companies || []);
          setTotal(res.data.total || 0);
          setTotalPages(res.data.pages || 1);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load companies.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [debouncedSearch, industry, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
            Company Directory
          </span>
          <span className="text-xs font-medium text-slate-500">{total} Employers</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Hiring Companies
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Browse technology employers, explore their industry focus, and view open jobs and internships.
        </p>
      </div>

      {/* Search & Industry Filters */}
      <div className="space-y-4">
        <div className="max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            aria-label="Search companies"
            placeholder="Search by company name (e.g. Google, TCS, Flipkart)..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            className="w-full text-xs text-slate-800 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 bg-white shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <button
            type="button"
            onClick={() => { setIndustry('All'); setPage(1); }}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              industry === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Industries
          </button>
          {industries.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => { setIndustry(ind); setPage(1); }}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                industry === ind
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No companies matched your search</h3>
          <p className="text-xs text-slate-500">Try clearing the industry filter or searching for another company.</p>
          <button
            type="button"
            onClick={() => { setSearchInput(''); setDebouncedSearch(''); setIndustry('All'); setPage(1); }}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {companies.map((comp) => (
              <CompanyCard key={comp._id} company={comp} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-medium text-slate-600">
                Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyDirectoryPage;
