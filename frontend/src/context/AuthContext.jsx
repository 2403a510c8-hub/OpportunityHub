import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('opportunity_hub_token'));
  const [loading, setLoading] = useState(true);

  // Initialize or fetch current user profile
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        // Fallback default: set demo student account for instant frictionless exploration
        try {
          const res = await authApi.demoSwitch('applicant');
          if (res?.data?.token) {
            localStorage.setItem('opportunity_hub_token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
          }
        } catch (e) {
          // If backend isn't up, provide initial mock user so UI renders beautifully
          setUser({
            id: 'usr_student_01',
            name: 'Alex Rivera',
            email: 'alex@example.com',
            role: 'applicant',
            headline: 'Computer Science Senior @ Stanford | Full-Stack & ML',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS']
          });
        }
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res?.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.warn('Session expired or backend offline:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.data?.token) {
      localStorage.setItem('opportunity_hub_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res?.data?.token) {
      localStorage.setItem('opportunity_hub_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('opportunity_hub_token');
    setToken(null);
    setUser(null);
  };

  const switchRole = async (targetRole) => {
    setLoading(true);
    try {
      const res = await authApi.demoSwitch(targetRole);
      if (res?.data?.token) {
        localStorage.setItem('opportunity_hub_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
    } catch (err) {
      // Offline fallback simulation
      if (targetRole === 'recruiter') {
        setUser({
          id: 'usr_recruiter_01',
          name: 'Elena Vance',
          email: 'elena@stripe.com',
          role: 'recruiter',
          organization: 'Stripe',
          headline: 'University Talent Lead @ Stripe',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80'
        });
      } else {
        setUser({
          id: 'usr_student_01',
          name: 'Alex Rivera',
          email: 'alex@example.com',
          role: 'applicant',
          headline: 'Computer Science Senior @ Stanford | Full-Stack & ML',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS']
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const res = await authApi.updateProfile(profileData);
    if (res?.data) {
      setUser(res.data);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isRecruiter: user?.role === 'recruiter' || user?.role === 'admin',
        login,
        register,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
