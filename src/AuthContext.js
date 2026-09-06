// ============================================================
//  AuthContext — Admin-Only Governance Portal Authentication
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';

// Pre-seeded ADMIN accounts for PAIMANA-EWS
const ADMIN_USERS = [
  { uid: 'admin-1', email: 'admin@pmc.gov.in',          password: 'admin123',       name: 'Rajesh Patil',    role: 'gov-admin' },
  { uid: 'admin-2', email: 'director@pmc.gov.in',       password: 'director123',    name: 'Priya Deshmukh',  role: 'gov-admin' },
  { uid: 'admin-3', email: 'commissioner@pmc.gov.in',   password: 'commissioner123',name: 'Suresh Jadhav',   role: 'gov-admin' },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    let unsub = null;
    try {
      const fb = require('./firebase');
      if (!fb.auth || !fb.initialized) return;
      unsub = fb.onAuthChange(async (fbUser) => {
        if (fbUser) {
          setUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName || fbUser.email.split('@')[0], role: 'gov-admin' });
        } else { setUser(null); }
      });
    } catch (e) {}
    return () => { if (unsub) unsub(); };
  }, []);

  // LOGIN — admin portal
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const fb = require('./firebase');
      if (fb.initialized && fb.auth) { await fb.loginUser(email, password); setAuthLoading(false); return { ok: true }; }
    } catch (e) {}

    const found = ADMIN_USERS.find(u => u.email === email && u.password === password);
    if (found) { 
      const { password: _, ...safe } = found; 
      setUser(safe); 
      setAuthLoading(false); 
      return { ok: true }; 
    }
    setAuthLoading(false);
    return { ok: false, error: 'Invalid admin credentials. Access restricted to authorized officials.' };
  };

  const logout = async () => {
    try { const fb = require('./firebase'); if (fb.initialized) await fb.logoutUser(); } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading, ADMIN_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
