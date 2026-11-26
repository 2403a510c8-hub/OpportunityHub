import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { opportunityApi, bookmarkApi } from '../services/api';
import { Badge } from '../components/common/Badge';
import { ApplyModal } from '../components/opportunities/ApplyModal';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  Share2,
  CheckCircle2,
  Briefcase,
  Building,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await opportunityApi.getById(id);
        if (res?.data) {
          setOpportunity(res.data);
          setBookmarked(res.data.userHasBookmarked || false);
        }
      } catch (err) {
        addToast('Opportunity not found or unavailable', 'error');
        navigate('/opportunities');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id, navigate, addToast]);

  const handleToggleBookmark = async () => {
    if (!user) {
      addToast('Please sign in to save opportunities', 'info');
      return;
    }

    try {
      const res = await bookmarkApi.toggle(opportunity.id);
      setBookmarked(res.bookmarked);
      addToast(
        res.bookmarked ? 'Saved to bookmarks!' : 'Removed from bookmarks',
        'success'
      );
    } catch (e) {
      setBookmarked(!bookmarked);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Opportunity link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/opportunities" className="hover:text-indigo-600 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400">{opportunity.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{opportunity.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Logo & Core Info */}
          <div className="flex items-start gap-5">
            <img
              src={opportunity.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${opportunity.organization}`}
              alt={opportunity.organization}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-md flex-shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={opportunity.type}>{opportunity.type}</Badge>
                <Badge variant={opportunity.workMode}>{opportunity.workMode}</Badge>
                <Badge variant="default">{opportunity.category}</Badge>
                {opportunity.featured && <Badge variant="featured">★ Top Pick</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {opportunity.title}
              </h1>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 flex-wrap pt-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  {opportunity.organization}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {opportunity.location}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex md:flex-col items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsApplyOpen(true)}
              disabled={opportunity.userHasApplied}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition disabled:opacity-60 disabled:cursor-not-allowed text-center"
            >
              {opportunity.userHasApplied ? 'Application Submitted ✓' : 'Apply Now'}
            </button>

            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleToggleBookmark}
                className={`p-2.5 rounded-xl border transition flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold ${
                  bookmarked
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Detailed Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About this Opportunity</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>

            {opportunity.tags && opportunity.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-1">Tags:</span>
                {opportunity.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-3">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Eligibility & Requirements</h2>
              <ul className="space-y-3">
                {opportunity.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Perks & Benefits */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Benefits & Grants</h2>
              <ul className="space-y-3">
                {opportunity.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Sidebar Key Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
              Opportunity Summary
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Compensation / Prize
                </span>
                <span className="font-extrabold text-slate-900 text-base mt-0.5 block">
                  {opportunity.salaryOrStipend}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Experience Level
                </span>
                <span className="font-semibold text-slate-700 block mt-0.5">
                  {opportunity.experienceLevel || 'Open to All'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Application Deadline
                </span>
                <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mt-0.5">
                  {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Total Applicants
                </span>
                <span className="font-semibold text-slate-700 block mt-0.5">
                  {opportunity.applicantsCount || 0} candidates applied
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsApplyOpen(true)}
                disabled={opportunity.userHasApplied}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {opportunity.userHasApplied ? 'Submitted' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Opportunities */}
      {opportunity.related && opportunity.related.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Similar {opportunity.category} Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunity.related.map((rel) => (
              <OpportunityCard key={rel.id} opportunity={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Apply Modal */}
      <ApplyModal
        opportunity={opportunity}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSuccess={() => setOpportunity((prev) => ({ ...prev, userHasApplied: true }))}
      />
    </div>
  );
};
