import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Heart, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Opportunity<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The unified gateway connecting students, developers, and researchers with internships, high-impact hackathons, scholarships, and grants.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-800 px-2.5 py-1 rounded-full text-indigo-300">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                V2026 Release
              </span>
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/opportunities?type=Internship" className="hover:text-white transition">
                  Tech Internships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Hackathon" className="hover:text-white transition">
                  Global Hackathons
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Scholarship" className="hover:text-white transition">
                  Diversity Scholarships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Full-Time" className="hover:text-white transition">
                  New Grad Jobs
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=Fellowship" className="hover:text-white transition">
                  Research Fellowships
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Organizations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Post an Opportunity
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Candidate Pipeline
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Campus Ambassador Network
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Hackathon Sponsorship
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Updates */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Stay in the Loop
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              Get weekly curated opportunity alerts directly in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to opportunity alerts!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="developer@stanford.edu"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Opportunity Hub Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
