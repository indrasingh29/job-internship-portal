import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Layers,
  Database,
  Shield,
  Server,
  Cloud,
  CheckCircle2,
  Cpu,
  Lock,
  ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Academic Project Overview
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Job &amp; Internship Portal
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          B.Tech CSE Minor Project (Academic Session 2026–27) designed and implemented by <strong className="text-slate-900">Indra Singh Jeena</strong>.
        </p>
      </div>

      {/* Project Metadata Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        <div className="pt-2 sm:pt-0">
          <p className="text-slate-400 font-semibold uppercase tracking-wider">Project Owner</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1">Indra Singh Jeena</p>
        </div>
        <div className="pt-2 sm:pt-0">
          <p className="text-slate-400 font-semibold uppercase tracking-wider">Degree & Branch</p>
          <p className="text-sm font-extrabold text-brand-600 mt-1">B.Tech CSE</p>
        </div>
        <div className="pt-2 sm:pt-0">
          <p className="text-slate-400 font-semibold uppercase tracking-wider">Academic Session</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1">2026–27</p>
        </div>
        <div className="pt-2 sm:pt-0">
          <p className="text-slate-400 font-semibold uppercase tracking-wider">Target Hosting</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1">Render + Atlas</p>
        </div>
      </div>

      {/* Architecture & Flow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Full-Stack MERN Architecture</h2>
            <p className="text-xs text-slate-500">Tiered separation of concerns with asynchronous REST communication</p>
          </div>
        </div>

        {/* Visual Architecture Representation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-brand-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Client Layer
            </span>
            <h3 className="font-bold text-slate-900 text-sm">React 18 + Vite SPA</h3>
            <p className="text-slate-600 leading-relaxed">
              Tailwind CSS responsive design, React Router dynamic routing, Recharts dashboard visualizations, and centralized Axios interceptors injecting JWT tokens.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-indigo-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Server className="w-4 h-4" /> API Server Layer
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Express.js on Node.js</h3>
            <p className="text-slate-600 leading-relaxed">
              Modular controllers, JWT authentication middleware, strict role-based access control (Student, Recruiter, Admin), Helmet security headers, and rate limiting.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-emerald-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Database className="w-4 h-4" /> Database Layer
            </span>
            <h3 className="font-bold text-slate-900 text-sm">MongoDB Atlas</h3>
            <p className="text-slate-600 leading-relaxed">
              Mongoose ODM schemas with compound unique indexing to eliminate duplicate applications, pre-save bcrypt hashing, and text search indexes.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Database Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Security &amp; Authorization</h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Argon/Bcrypt Hashing:</strong> Passwords hashed with 10 salt rounds before database persistence.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Server-Side Role Guard:</strong> All privileged recruiter and admin endpoints verify permissions on the backend.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Rate Limiting &amp; Helmet:</strong> Express rate limiter guards auth endpoints against brute force attempts.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Database Optimization</h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Duplicate Prevention:</strong> Compound unique index on <code>(job, student)</code> prevents duplicate applications.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Text Indexing:</strong> Mongoose text index across <code>title</code>, <code>description</code>, and <code>requiredSkills</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Idempotent Seeder:</strong> Production-safe seed script generating 50 companies and 52 distinct job listings.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Deployment Details */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-brand-400" />
          Cloud Deployment Architecture
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The application is structured for zero-configuration deployment on <strong>Render</strong>:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="font-bold text-brand-400">Frontend (Render Static Site)</p>
            <p className="text-slate-300 mt-1">Build command: <code>npm install && npm run build</code></p>
            <p className="text-slate-300 mt-0.5">Publish directory: <code>dist</code></p>
            <p className="text-slate-400 mt-1">SPA rewrites configured via <code>public/_redirects</code>.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="font-bold text-brand-400">Backend (Render Web Service)</p>
            <p className="text-slate-300 mt-1">Build command: <code>npm install</code></p>
            <p className="text-slate-300 mt-0.5">Start command: <code>npm start</code></p>
            <p className="text-slate-400 mt-1">Binds dynamically to <code>process.env.PORT</code> with Atlas connection string.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
