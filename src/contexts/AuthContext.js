import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile, isAuthenticated } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  /**
   * Load user profile on mount
   */
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const response = await getProfile();
          if (response.success) {
            setUser(response.data);
            setIsAuth(true);
          }
        } catch (err) {
          console.error('Error loading user:', err);
          setIsAuth(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    try {
      const response = await apiRegister(name, email, password);
      if (response.success) {
        setUser(response.data.user);
        setIsAuth(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      if (response.success) {
        setUser(response.data.user);
        setIsAuth(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuth,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}