import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      verifyUser(storedToken);
    } else {
      // Try remember-me if no stored token
      verifyRememberMe();
    }
  }, []);

  // Verify user with server
  async function verifyUser(authToken) {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid
        localStorage.removeItem('authToken');
        setToken(null);
      }
    } catch (err) {
      console.error('Error verifying user:', err);
    } finally {
      setLoading(false);
    }
  }

  // Verify remember-me token
  async function verifyRememberMe() {
    try {
      const response = await fetch('/api/auth/remember-me', {
        method: 'POST',
        credentials: 'include' // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error verifying remember-me:', err);
      setLoading(false);
    }
  }

  // Signup
  async function signup(email, password, firstName, lastName, phone, countryCode) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone, countryCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Auto-login after signup
      await login(email, password);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  // Login
  async function login(email, password, rememberMe = false, recaptchaToken = null) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password, rememberMe, recaptchaToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function logout() {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setError(null);
    
    // Clear remember-me token in database
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Error clearing remember-me:', err);
    }
  }

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
