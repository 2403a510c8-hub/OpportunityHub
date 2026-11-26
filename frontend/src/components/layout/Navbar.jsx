import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { statsApi } from '../../services/api';
import {
  Compass,
  Briefcase,
  Bookmark,
  Bell,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ArrowRightLeft,
  Sparkles,
  CheckCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, switchRole, isRecruiter } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await statsApi.getNotifications();
        if (res?.data) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (e) {
        // Mock fallback notifications
        setNotifications([
          {
            id: 'n1',
            title: 'Hackathon Accepted!',
            message: 'Your registration for Global AI & Climate Innovation Hackathon was approved.',
            read: false,
            createdAt: 'Just now'
          }
        ]);
        setUnreadCount(1);
      }
    }

    if (user) {
      fetchNotifs();
    }
  }, [user]);

  const handleRoleToggle = async () => {
    const nextRole = user?.role === 'recruiter' ? 'applicant' : 'recruiter';
    await switchRole(nextRole);
    addToast(`Switched active view to: ${nextRole === 'recruiter' ? 'Recruiter (Elena Vance - Stripe)' : 'Applicant (Alex Rivera - Stanford)'}`, 'info');
  };

  const handleMarkAllRead = async () => {
    try {
      await statsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      addToast('Marked all notifications as read', 'success');
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const navLinks = [
    { label: 'Explore', path: '/opportunities', icon: Compass },
    ...(!isRecruiter
      ? [
          { label: 'My Applications', path: '/my-applications', icon: Briefcase },
          { label: 'Saved', path: '/my-applications?tab=saved', icon: Bookmark },
        ]
      : [
          { label: 'Recruiter Dashboard', path: '/dashboard', icon: Briefcase },
        ]),
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 glass-header">
      {/* Top Demo Context Banner */}
      <div className="bg-indigo-900 text-indigo-100 text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>
            Demo Mode Active: You are logged in as{' '}
            <strong className="text-white font-semibold">
              {user?.name || 'Guest'} ({user?.role === 'recruiter' ? 'Recruiter' : 'Student Applicant'})
            </strong>
          </span>
        </div>
        <button
          onClick={handleRoleToggle}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-700 hover:bg-indigo-600 text-white font-medium text-xs transition"
          title="Toggle between Student Applicant and Organization Recruiter"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Switch to {user?.role === 'recruiter' ? 'Student View' : 'Recruiter View'}</span>
        </button>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                Opportunity<span className="text-indigo-600">Hub</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-md ml-0.5">
                  v1.0
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Post Button for Recruiters */}
            {isRecruiter && (
              <Link
                to="/dashboard?action=post"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition hover:shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Opportunity</span>
              </Link>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-800">Notifications ({unreadCount})</span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-slate-50 transition text-left ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                            <span className="text-[10px] text-slate-400">
                              {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Link */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition group"
                  title="View Profile"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize leading-none mt-1">{user.role}</p>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Icon className="w-5 h-5 text-slate-400" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                handleRoleToggle();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Switch to {user?.role === 'recruiter' ? 'Applicant View' : 'Recruiter View'}
            </button>

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <User className="w-4 h-4" /> Profile Details
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
