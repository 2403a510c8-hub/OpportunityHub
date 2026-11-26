import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationApi } from '../../services/api';
import {
  X,
  Send,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const ApplyModal = ({ opportunity, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || 'https://alexrivera.dev/resume.pdf');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio || user?.github || 'https://alexrivera.dev');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [coverNote, setCoverNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await applicationApi.apply({
        opportunityId: opportunity.id,
        resumeUrl,
        portfolioUrl,
        applicantPhone: phone,
        coverNote,
        answers: {
          experience: 'Student Senior',
          appliedAtSource: 'Opportunity Hub Web'
        }
      });

      setSubmitted(true);
      addToast(`Successfully applied to ${opportunity.title}!`, 'success');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your application for <strong className="text-slate-800">{opportunity.title}</strong> at{' '}
              <strong className="text-slate-800">{opportunity.organization}</strong> has been transmitted.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Application Form
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{opportunity.title}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {opportunity.organization} • {opportunity.location} • {opportunity.salaryOrStipend}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Applicant Name & Email (Readonly) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Resume Link */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Resume / CV Link
                </label>
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://yourdomain.com/resume.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Link to a publicly viewable PDF on Google Drive, GitHub, or Dropbox.
                </span>
              </div>

              {/* Portfolio / GitHub */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                  Portfolio or GitHub URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/yourhandle"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Cover Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Why are you a great match for this opportunity?
                </label>
                <textarea
                  rows={3}
                  required
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Mention your relevant projects, hackathon achievements, or passion for this role..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
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
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
