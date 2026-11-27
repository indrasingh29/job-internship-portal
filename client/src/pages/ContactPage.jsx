import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, HelpCircle, ShieldCheck, Briefcase } from 'lucide-react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact JobPortal
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Need help with your account, job postings, or applications? Send us a message using the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Helpful Links Sidebar */}
        <div className="bg-slate-900 rounded-3xl p-7 text-white space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Quick Self-Service</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Common actions you can complete directly on the platform.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Account Access</p>
                  <p className="text-slate-400 mt-0.5">
                    Forgot your password?{' '}
                    <Link to="/forgot-password" className="text-brand-400 hover:underline font-medium">
                      Reset it here
                    </Link>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Employer Onboarding</p>
                  <p className="text-slate-400 mt-0.5">
                    Hiring for your team?{' '}
                    <Link to="/register?role=recruiter" className="text-brand-400 hover:underline font-medium">
                      Register as a Recruiter
                    </Link>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Explore Listings</p>
                  <p className="text-slate-400 mt-0.5">
                    Browse active{' '}
                    <Link to="/jobs" className="text-brand-400 hover:underline font-medium">jobs</Link>{' '}
                    and{' '}
                    <Link to="/internships" className="text-brand-400 hover:underline font-medium">internships</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Send a Message</h2>
          <p className="text-xs text-slate-500 mb-6">Fill out the details below and our team will review your inquiry.</p>

          {submitted && (
            <div className="p-4 rounded-2xl mb-6 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-3 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Your message has been recorded. Thank you for reaching out.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block font-bold text-slate-700 mb-1">Subject *</label>
              <input
                id="contact-subject"
                type="text"
                required
                placeholder="How can we help?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-bold text-slate-700 mb-1">Message *</label>
              <textarea
                id="contact-message"
                rows={5}
                required
                placeholder="Describe your question or feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
