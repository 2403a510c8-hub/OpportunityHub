import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { opportunityApi, statsApi } from '../services/api';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { ApplyModal } from '../components/opportunities/ApplyModal';
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Globe2,
  Users,
  Compass,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [stats, setStats] = useState({
    activeOpportunities: 1450,
    totalApplications: 6200,
    totalUsers: 9800,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const featRes = await opportunityApi.getFeatured();
        if (featRes?.data && featRes.data.length > 0) {
          setFeaturedOpportunities(featRes.data);
        }

        const statsRes = await statsApi.getPlatformStats();
        if (statsRes?.data?.metrics) {
          setStats(statsRes.data.metrics);
        }
      } catch (err) {
        console.warn('Using default demo data on home page');
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/opportunities');
    }
  };

  const handleApply = (opp) => {
    setSelectedOpportunity(opp);
    setIsApplyOpen(true);
  };

  const quickCategories = [
    { label: '💼 Internships', type: 'Internship' },
    { label: '🏆 Hackathons', type: 'Hackathon' },
    { label: '🎓 Scholarships', type: 'Scholarship' },
    { label: '⚡ Remote Tech Jobs', type: 'Full-Time' },
    { label: '🔬 Research Grants', type: 'Fellowship' }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Discover Summer 2026 Opportunities & Global Hackathons</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Launch Your Future with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              High-Impact Opportunities
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            The all-in-one hub connecting ambitious students, developers, and researchers to prestigious internships, high-prize hackathons, and research grants.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 flex items-center gap-2"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company (e.g. Stripe, MIT, NASA), or skill..."
              className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-indigo-600/30 flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Trending:</span>
            {quickCategories.map((cat) => (
              <button
                key={cat.type}
                onClick={() => navigate(`/opportunities?type=${cat.type}`)}
                className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-600 rounded-full border border-slate-200 text-slate-600 transition shadow-sm"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Platform Metrics Ticker */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/80">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats.activeOpportunities ? `${stats.activeOpportunities}+` : '1,450+'}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">Active Opportunities</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">$2.5M+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Prizes & Grants</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">350+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Partner Tech Companies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">98%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Verified Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              Hand-Picked
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top curated internships, hackathons, and research grants closing soon.
            </p>
          </div>
          <Link
            to="/opportunities"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onApplyClick={handleApply}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-sm"
          >
            View All Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Opportunity Hub Feature Grid */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
            Why Opportunity Hub
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Designed for Modern Builders & Recruiters
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No endless spam or expired job boards. Every listing is verified with clear compensation, deadlines, and direct review channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Transparent Compensation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every internship and full-time role includes upfront hourly rates, stipends, or prize money breakdowns.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Global & Remote Friendly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter easily between remote-first hackathons, hybrid internships, and on-site corporate programs worldwide.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Real-Time Application Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never wonder if your resume fell into a void. Track stage updates: Submitted, Under Review, Interview, or Offered.
            </p>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {selectedOpportunity && (
        <ApplyModal
          opportunity={selectedOpportunity}
          isOpen={isApplyOpen}
          onClose={() => {
            setIsApplyOpen(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
};
