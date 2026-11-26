import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookmarkApi } from '../../services/api';
import {
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  ExternalLink,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const OpportunityCard = ({
  opportunity,
  onApplyClick,
  isBookmarked: initialBookmarked = false,
  viewMode = 'grid'
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please sign in to save opportunities', 'info');
      return;
    }

    setBookmarkLoading(true);
    try {
      const res = await bookmarkApi.toggle(opportunity.id);
      setBookmarked(res.bookmarked);
      addToast(
        res.bookmarked
          ? `Saved "${opportunity.title}" to bookmarks`
          : `Removed from bookmarks`,
        'success'
      );
    } catch (err) {
      setBookmarked(!bookmarked);
      addToast(bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks', 'info');
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Calculate days remaining
  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const diffTime = new Date(deadline) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Closed';
    if (diffDays === 0) return 'Closes today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const daysLeft = getDaysLeft(opportunity.deadline);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-indigo-400 hover:shadow-md transition-all duration-200 group flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Logo & Info */}
        <div className="flex items-start gap-4">
          <img
            src={opportunity.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${opportunity.organization}`}
            alt={opportunity.organization}
            className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant={opportunity.type}>{opportunity.type}</Badge>
              <Badge variant={opportunity.workMode}>{opportunity.workMode}</Badge>
              {opportunity.featured && <Badge variant="featured">★ Featured</Badge>}
            </div>

            <Link
              to={`/opportunities/${opportunity.id}`}
              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition block"
            >
              {opportunity.title}
            </Link>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="font-semibold text-slate-700">{opportunity.organization}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {opportunity.salaryOrStipend}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Deadline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysLeft}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              {opportunity.applicantsCount || 0} applicants
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              disabled={bookmarkLoading}
              className={`p-2.5 rounded-xl border transition ${
                bookmarked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <Link
              to={`/opportunities/${opportunity.id}`}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"
            >
              View Details
            </Link>

            {onApplyClick && (
              <button
                onClick={() => onApplyClick(opportunity)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
              >
                Apply
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header row: Logo, badges & bookmark */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={opportunity.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${opportunity.organization}`}
              alt={opportunity.organization}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {opportunity.organization}
              </h4>
              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {opportunity.location}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleBookmark}
            disabled={bookmarkLoading}
            className={`p-2 rounded-xl border transition ${
              bookmarked
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <Badge variant={opportunity.type}>{opportunity.type}</Badge>
          <Badge variant={opportunity.workMode}>{opportunity.workMode}</Badge>
          {opportunity.featured && <Badge variant="featured">★ Top Pick</Badge>}
        </div>

        {/* Title */}
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 mb-2 leading-snug"
        >
          {opportunity.title}
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {opportunity.description}
        </p>

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {opportunity.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {opportunity.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">
                +{opportunity.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        {/* Compensation & Deadline */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 bg-slate-100/90 px-2.5 py-1 rounded-lg">
            {opportunity.salaryOrStipend}
          </span>
          <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3" />
            {daysLeft}
          </span>
        </div>

        {/* Bottom Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/opportunities/${opportunity.id}`}
            className="w-full py-2 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Details
          </Link>
          <button
            onClick={() => onApplyClick ? onApplyClick(opportunity) : null}
            className="w-full py-2 text-center text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center justify-center gap-1"
          >
            <span>Apply</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
