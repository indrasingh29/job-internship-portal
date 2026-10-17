import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Phone, MapPin, Building2, HelpCircle } from 'lucide-react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Support &amp; Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Have questions regarding the Job &amp; Internship Portal or academic project evaluation? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Project Contacts</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Developed for B.Tech CSE Minor Project Evaluation (Academic Session 2026–27).
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400">Email Address</p>
                  <p className="font-semibold text-white mt-0.5">indra.jeena@example.edu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400">Institution</p>
                  <p className="font-semibold text-white mt-0.5">Department of Computer Science &amp; Engineering</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400">Project Lead</p>
                  <p className="font-semibold text-white mt-0.5">Indra Singh Jeena</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-[11px] text-slate-300">
            <p className="font-semibold text-white">Project Viva &amp; Demo Support</p>
            <p className="text-slate-400 mt-0.5">
              Available for live project defense, code walkthroughs, and architecture reviews.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Send a Direct Message</h3>
          <p className="text-xs text-slate-500 mb-6">Fill out the form below to submit your inquiry.</p>

          {submitted && (
            <div className="p-4 rounded-2xl mb-6 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-3 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your inquiry has been submitted. We will get back to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Question regarding minor project viva"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message</label>
              <textarea
                rows={5}
                required
                placeholder="Write your message or inquiry here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
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
