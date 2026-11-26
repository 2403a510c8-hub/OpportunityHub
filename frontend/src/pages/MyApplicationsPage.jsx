import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationApi, bookmarkApi } from '../services/api';
import { Badge } from '../components/common/Badge';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { ApplyModal } from '../components/opportunities/ApplyModal';
import {
  Briefcase,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  SearchX,
  FileText
} from 'lucide-react';

export const MyApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'saved' ? 'saved' : 'applications';

  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [appRes, bmRes] = await Promise.all([
          applicationApi.getMyApplications().catch(() => ({ data: [] })),
          bookmarkApi.getAll().catch(() => ({ data: [] }))
        ]);

        if (appRes?.data) setApplications(appRes.data);
        if (bmRes?.data) setBookmarks(bmRes.data);
      } catch (err) {
        console.error('Error loading user applications or bookmarks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams(tab === 'saved' ? { tab: 'saved' } : {});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Applicant Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your submitted application stages and manage bookmarked opportunities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => handleTabChange('applications')}
          className={`flex items-center gap-2 pb-3.5 text-sm font-semibold transition border-b-2 ${
            activeTab === 'applications'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('saved')}
          className={`flex items-center gap-2 pb-3.5 text-sm font-semibold transition border-b-2 ${
            activeTab === 'saved'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Opportunities ({bookmarks.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your candidate records...</p>
        </div>
      ) : activeTab === 'applications' ? (
        applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to take the next step? Explore open tech internships, hackathons, and grants.
            </p>
            <Link
              to="/opportunities"
              className="inline-flex px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Opportunity Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={app.opportunity?.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.opportunity?.organization}`}
                    alt={app.opportunity?.organization}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={app.opportunity?.type || 'Internship'}>
                        {app.opportunity?.type || 'Internship'}
                      </Badge>
                      <Badge variant={app.status}>{app.status}</Badge>
                    </div>

                    <Link
                      to={`/opportunities/${app.opportunityId}`}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition"
                    >
                      {app.opportunity?.title}
                    </Link>

                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {app.opportunity?.organization} • Applied on{' '}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>

                    {app.coverNote && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic line-clamp-2">
                        "{app.coverNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Pipeline Step Tracker */}
                <div className="flex items-center gap-2 self-start md:self-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Stage:</span>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved opportunities yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any opportunity card to save it for quick reference later.
          </p>
          <Link
            to="/opportunities"
            className="inline-flex px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Find Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isBookmarked={true}
              onApplyClick={(target) => {
                setSelectedOpp(target);
                setIsApplyOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {selectedOpp && (
        <ApplyModal
          opportunity={selectedOpp}
          isOpen={isApplyOpen}
          onClose={() => {
            setIsApplyOpen(false);
            setSelectedOpp(null);
          }}
        />
      )}
    </div>
  );
};
