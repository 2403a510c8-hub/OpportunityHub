import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { opportunityApi } from '../services/api';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { FilterSidebar } from '../components/opportunities/FilterSidebar';
import { ApplyModal } from '../components/opportunities/ApplyModal';
import { LayoutGrid, List, SearchX, Sparkles } from 'lucide-react';

export const OpportunitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from query params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'All',
    category: searchParams.get('category') || 'All',
    workMode: searchParams.get('workMode') || 'All',
    sortBy: 'newest'
  });

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.type && filters.type !== 'All') params.type = filters.type;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.workMode && filters.workMode !== 'All') params.workMode = filters.workMode;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch opportunities whenever filters change
  useEffect(() => {
    async function fetchOpportunities() {
      setLoading(true);
      try {
        const res = await opportunityApi.getAll(filters);
        if (res?.data) {
          setOpportunities(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchOpportunities, 150); // slight debounce for keyword
    return () => clearTimeout(timer);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      category: 'All',
      workMode: 'All',
      sortBy: 'newest'
    });
  };

  const handleApply = (opp) => {
    setSelectedOpportunity(opp);
    setIsApplyOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse internships, hackathons, fellowships, and full-time tech positions.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1">View:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalResults={opportunities.length}
          />
        </div>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active filter badges */}
          {(filters.search || filters.type !== 'All' || filters.category !== 'All' || filters.workMode !== 'All') && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-semibold">Active:</span>
              {filters.search && (
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.type !== 'All' && (
                <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                  Type: {filters.type}
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Category: {filters.category}
                </span>
              )}
              {filters.workMode !== 'All' && (
                <span className="bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full border border-cyan-200">
                  Mode: {filters.workMode}
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-indigo-600 hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Loading opportunities...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching opportunities found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, selecting "All Categories", or removing filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onApplyClick={handleApply}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onApplyClick={handleApply}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
