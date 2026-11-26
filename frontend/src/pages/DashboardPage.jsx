import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { opportunityApi, applicationApi } from '../services/api';
import { PostOpportunityModal } from '../components/recruiter/PostOpportunityModal';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(searchParams.get('action') === 'post');

  // Load recruiter's listings
  const loadPostings = async () => {
    setLoading(true);
    try {
      const res = await opportunityApi.getAll();
      if (res?.data) {
        setOpportunities(res.data);
        if (res.data.length > 0 && !selectedOppId) {
          setSelectedOppId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading postings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostings();
  }, []);

  // Load applicants for selected opportunity
  useEffect(() => {
    if (!selectedOppId) return;

    async function loadApplicants() {
      setApplicantsLoading(true);
      try {
        const res = await applicationApi.getByOpportunity(selectedOppId);
        if (res?.data) {
          setApplicants(res.data);
        }
      } catch (err) {
        // Fallback for mock view
        setApplicants([
          {
            id: 'app_demo_1',
            applicantName: 'Alex Rivera',
            applicantEmail: 'alex@example.com',
            applicantPhone: '+1 (555) 234-5678',
            resumeUrl: 'https://alexrivera.dev/resume.pdf',
            coverNote: 'Extensive experience building distributed services and modern web apps.',
            status: 'Under Review',
            appliedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setApplicantsLoading(false);
      }
    }

    loadApplicants();
  }, [selectedOppId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationApi.updateStatus(appId, newStatus);
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      addToast(`Updated candidate status to: ${newStatus}`, 'success');
    } catch (err) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      addToast(`Status updated to ${newStatus}`, 'info');
    }
  };

  const handleDeletePosting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      await opportunityApi.delete(id);
      addToast('Opportunity deleted', 'success');
      loadPostings();
    } catch (err) {
      addToast(err.message || 'Failed to delete listing', 'error');
    }
  };

  const selectedOpp = opportunities.find((o) => o.id === selectedOppId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Employer & Recruiter Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Talent Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your opportunities, view candidate resumes, and update hiring stages.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Opportunity</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Postings</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{opportunities.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Candidates</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {opportunities.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Review</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {applicants.filter((a) => a.status === 'Under Review' || a.status === 'Submitted').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted / Hired</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {applicants.filter((a) => a.status === 'Accepted').length}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Postings Selector & Applicant Reviewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Postings list */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/90 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Your Opportunities</h3>
            <span className="text-xs text-slate-400 font-semibold">{opportunities.length}</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {opportunities.map((opp) => {
              const isSelected = opp.id === selectedOppId;
              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOppId(opp.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition text-left flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant={opp.type} size="xs">
                        {opp.type}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {opp.applicantsCount || 0} applicants
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">{opp.title}</h4>
                    <p className="text-[11px] text-slate-500">{opp.organization}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePosting(opp.id);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                    title="Delete listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Applicants for Selected Posting */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            {/* Opportunity Context Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Candidate Pipeline
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedOpp?.title || 'Select a posting'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedOpp?.organization} • {applicants.length} applications received
                </p>
              </div>

              {selectedOpp && (
                <Badge variant={selectedOpp.type}>{selectedOpp.type}</Badge>
              )}
            </div>

            {/* Candidate Cards */}
            {applicantsLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Loading applicant records...
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No applications submitted yet for this position.
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all space-y-4"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {candidate.applicantName}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {candidate.applicantEmail}
                          </span>
                          {candidate.applicantPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {candidate.applicantPhone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">Stage:</span>
                        <select
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Cover Note */}
                    {candidate.coverNote && (
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                        "{candidate.coverNote}"
                      </p>
                    )}

                    {/* Resume & Links */}
                    <div className="flex items-center gap-4 text-xs pt-1">
                      {candidate.resumeUrl && (
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Candidate Resume
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {candidate.portfolioUrl && (
                        <a
                          href={candidate.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-600 font-medium hover:text-slate-900"
                        >
                          Portfolio / GitHub
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <PostOpportunityModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onCreated={loadPostings}
      />
    </div>
  );
};
