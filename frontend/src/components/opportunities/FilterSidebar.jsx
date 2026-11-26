import React from 'react';
import { Filter, RotateCcw, Search, Sparkles } from 'lucide-react';

export const FilterSidebar = ({ filters, setFilters, onReset, totalResults = 0 }) => {
  const opportunityTypes = ['All', 'Internship', 'Hackathon', 'Scholarship', 'Full-Time', 'Fellowship'];
  const categories = ['All', 'Engineering', 'Data & AI', 'Design', 'Business'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Closing Soon', value: 'deadline' },
    { label: 'Most Popular', value: 'popular' }
  ];

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-sm">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            {totalResults}
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Keywords
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search role, skills, company..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Opportunity Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Opportunity Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {opportunityTypes.map((type) => {
            const isSelected = (filters.type || 'All') === type;
            return (
              <button
                key={type}
                onClick={() => setFilters((prev) => ({ ...prev, type }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition text-slate-800 font-medium"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Work Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {workModes.map((mode) => {
            const isSelected = (filters.workMode || 'All') === mode;
            return (
              <button
                key={mode}
                onClick={() => setFilters((prev) => ({ ...prev, workMode: mode }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-center transition ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Sort Results By
        </label>
        <div className="space-y-1.5">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                filters.sortBy === opt.value
                  ? 'bg-indigo-50/70 text-indigo-900 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={filters.sortBy === opt.value}
                onChange={() => setFilters((prev) => ({ ...prev, sortBy: opt.value }))}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
