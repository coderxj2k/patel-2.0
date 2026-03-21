import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateGoogleAuthUrl, exchangeCodeForTokens, getGoogleUserInfo } from './google-auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('patelElectronicsUser');
    const savedTokens = localStorage.getItem('patelElectronicsTokens');
    
    if (savedUser && savedTokens) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        clearAuthData();
      }
    }
    
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      setError('Authentication failed: ' + errorParam);
      setIsLoading(false);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (code) {
      handleGoogleCallback(code);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleGoogleCallback = async (code) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await exchangeCodeForTokens(code);
      
      // Get user info
      const userInfo = await getGoogleUserInfo(tokenResponse.access_token);
      
      // Save user data and tokens
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('patelElectronicsUser', JSON.stringify(userInfo));
      localStorage.setItem('patelElectronicsTokens', JSON.stringify(tokenResponse));
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      setError('Failed to authenticate with Google');
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // Generate Google OAuth URL and redirect
    const authUrl = generateGoogleAuthUrl({
      clientId: 'demo-google-client-id.apps.googleusercontent.com', // Replace with actual client ID
      redirectUri: window.location.origin,
      scope: 'openid email profile',
      responseType: 'code',
      accessType: 'offline',
      prompt: 'consent'
    });
    
    window.location.href = authUrl;
  };

  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate email login (in production, this would call your backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user for demo
      const mockUser = {
        id: 'email_' + Date.now(),
        email: email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        picture: `https://picsum.photos/seed/${email}/200/200.jpg`,
        given_name: email.split('@')[0].split('.')[0],
        family_name: email.split('@')[0].split('.')[1] || 'User',
        verified_email: true
      };
      
      const mockTokens = {
        access_token: 'demo_email_token_' + Date.now(),
        refresh_token: 'demo_email_refresh_' + Date.now(),
        expires_in: 3600,
        token_type: 'Bearer'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('patelElectronicsUser', JSON.stringify(mockUser));
      localStorage.setItem('patelElectronicsTokens', JSON.stringify(mockTokens));
      
    } catch (error) {
      console.error('Email login error:', error);
      setError('Failed to login with email');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('patelElectronicsUser');
    localStorage.removeItem('patelElectronicsTokens');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    loginWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
    
  );
};
