import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Compass, Sparkles, ArrowRight, Lock, Mail, User, Building } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, switchRole } = useAuth();
  const { addToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('applicant');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, role, organization });
        addToast('Account created successfully!', 'success');
      } else {
        await login(email, password);
        addToast('Welcome back to Opportunity Hub!', 'success');
      }
      navigate('/opportunities');
    } catch (err) {
      addToast(err.message || 'Authentication failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async (targetRole) => {
    setLoading(true);
    try {
      await switchRole(targetRole);
      addToast(
        `Logged in as Demo ${targetRole === 'recruiter' ? 'Recruiter (Elena Vance)' : 'Student (Alex Rivera)'}!`,
        'success'
      );
      navigate(targetRole === 'recruiter' ? '/dashboard' : '/opportunities');
    } catch (e) {
      navigate('/opportunities');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? 'Join Opportunity Hub' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Connect with top global internships, grants, and hackathons.'
              : 'Sign in to track your applications and saved opportunities.'}
          </p>
        </div>

        {/* 1-Click Fast Demo Buttons */}
        <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 space-y-2">
          <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider block text-center">
            ⚡ Quick 1-Click Demo Evaluation
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFastDemoLogin('applicant')}
              className="py-2 px-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-semibold text-xs hover:bg-indigo-600 hover:text-white hover:border-transparent transition text-center shadow-sm"
            >
              Student View
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin('recruiter')}
              className="py-2 px-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-semibold text-xs hover:bg-indigo-600 hover:text-white hover:border-transparent transition text-center shadow-sm"
            >
              Recruiter View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="h-px bg-slate-200 flex-1" />
          <span>or continue with email</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@stanford.edu"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('applicant')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                    role === 'applicant'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Student / Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                    role === 'recruiter'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Recruiter / Org
                </button>
              </div>

              {role === 'recruiter' && (
                <div className="mt-3">
                  <label className="block font-bold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. OpenAI, Stripe, MIT"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-indigo-600 hover:underline font-semibold"
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account yet? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
