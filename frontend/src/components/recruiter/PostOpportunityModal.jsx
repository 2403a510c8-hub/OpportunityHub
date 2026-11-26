import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { opportunityApi } from '../../services/api';
import { X, Sparkles, Plus, Check } from 'lucide-react';

export const PostOpportunityModal = ({ isOpen, onClose, onCreated }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: 'Internship',
    category: 'Engineering',
    workMode: 'Remote',
    location: 'Remote (US & Global)',
    salaryOrStipend: '$50/hour + Stipend',
    deadline: '2026-12-31',
    description: '',
    requirements: 'Proficiency in JavaScript or Python\nStrong problem-solving skills\nEager to learn and collaborate',
    responsibilities: 'Build features for web application\nParticipate in code reviews\nWrite documentation and tests',
    benefits: 'Flexible remote hours\nCompetitive pay\n1-on-1 mentorship',
    tags: 'React, Node.js, Web, Internship',
    applyUrl: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').filter(Boolean),
        benefits: formData.benefits.split('\n').filter(Boolean),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };

      await opportunityApi.create(payload);
      addToast('Opportunity successfully posted!', 'success');
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to post opportunity', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Recruiter Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Publish New Opportunity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create an internship, hackathon, scholarship, or full-time listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role / Opportunity Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineering Intern"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. OpenAI, Stripe, MIT"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Type, Category & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Internship">Internship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Fellowship">Fellowship</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Location, Compensation & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco or Remote"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stipend / Prize / Salary</label>
              <input
                type="text"
                name="salaryOrStipend"
                value={formData.salaryOrStipend}
                onChange={handleChange}
                placeholder="e.g. $55/hr or $25,000 Prize"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Description *</label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of what the candidate will work on..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Requirements (1 per line) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Requirements (one per line)</label>
              <textarea
                name="requirements"
                rows={3}
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Perks & Benefits (one per line)</label>
              <textarea
                name="benefits"
                rows={3}
                value={formData.benefits}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. React, TypeScript, Python, Hackathon"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
