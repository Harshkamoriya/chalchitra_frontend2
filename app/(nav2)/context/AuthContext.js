'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // Decoded JWT
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const initAuth = useCallback(() => {
    console.log('[initAuth] Initializing authentication...');
    let token = sessionStorage.getItem('accessToken');

    if (!token) {
      token = Cookies.get('accessToken');
      if (token) {
        sessionStorage.setItem('accessToken', token);
      }
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp > now) {
          setAccessToken(token);
          setUser(decoded);
          const role = Cookies.get('currentRole') || decoded.role || 'buyer';
          console.log('[initAuth] Decoded role:', decoded.role);
          console.log('[initAuth] Current role from cookies or fallback:', role);
          setActiveRole(role);
          localStorage.setItem('activeRole', role);
          Cookies.set('currentRole', role, { expires: 7, path: '/' });
        } else {
          console.log('[initAuth] Token expired');
          sessionStorage.removeItem('accessToken');
          Cookies.remove('accessToken');
          Cookies.remove('currentRole');
          localStorage.removeItem('activeRole');
        }
      } catch (err) {
        console.error('[initAuth] Invalid accessToken:', err);
        sessionStorage.removeItem('accessToken');
        Cookies.remove('accessToken');
        Cookies.remove('currentRole');
        localStorage.removeItem('activeRole');
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(() => {
    console.log('[login] Logging in...');
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        sessionStorage.setItem('accessToken', token);
        setAccessToken(token);
        setUser(decoded);
        const role = Cookies.get('currentRole') || decoded.role || 'buyer';
        console.log('[login] Set role:', role);
        setActiveRole(role);
        localStorage.setItem('activeRole', role);
        Cookies.set('currentRole', role, { expires: 7, path: '/' });
      } catch (err) {
        console.error('[login] Failed to decode token during login:', err);
      }
    } else {
      console.warn('[login] No accessToken in cookies during login');
    }
  }, []);

  const handleSwitch = useCallback(async () => {
    try {
      const currentRole = activeRole || localStorage.getItem('activeRole') || 'buyer';
      const newRole = currentRole === 'buyer' ? 'seller' : 'buyer';
      const previousRole = activeRole;
      console.log('[handleSwitch] Switching from', currentRole, 'to', newRole);

      setActiveRole(newRole); // Optimistic update

      const response = await api.patch('/api/user/switch-role', { newRole });

      localStorage.setItem('activeRole', newRole);
      Cookies.set('currentRole', newRole, { expires: 7, path: '/' });

      if (response.data.accessToken) {
        const newToken = response.data.accessToken;
        sessionStorage.setItem('accessToken', newToken);
        Cookies.set('accessToken', newToken, { expires: 7, path: '/' });
        const decoded = jwtDecode(newToken);
        setAccessToken(newToken);
        setUser(decoded);
        console.log('[handleSwitch] New token received and decoded:', decoded);
      }

      // router.push(newRole === 'buyer' ? '/user/buyer/profile/view' : '/seller/profile/edit');
    } catch (error) {
      console.error('[handleSwitch] Failed to switch role:', error);
      setActiveRole(previousRole);
    }
  }, [activeRole, router]);

  const getRole = useCallback(() => {
    const role = activeRole || localStorage.getItem('activeRole') || 'buyer';
    console.log('[getRole] Returning role:', role);
    return role;
  }, [activeRole]);

  const logout = useCallback(async () => {
    try {
      console.log('[logout] Logging out...');
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('[logout] Logout failed:', err);
    }
    sessionStorage.removeItem('accessToken');
    Cookies.remove('accessToken');
    Cookies.remove('currentRole');
    localStorage.removeItem('activeRole');
    setAccessToken(null);
    setUser(null);
    setActiveRole(null);
    router.push('/');
  }, [router]);

  useEffect(() => {
    console.log('[AuthContext] activeRole changed:', activeRole);
  }, [activeRole]);

  return (
    <AuthContext.Provider
      value={{ accessToken, activeRole, setActiveRole, user, getRole, loading, login, logout, handleSwitch }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
