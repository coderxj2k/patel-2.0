// Google OAuth 2.0 Configuration
export const googleAuthConfig = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google OAuth Client ID
  redirectUri: window.location.origin,
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
};

// For development/demo purposes
export const demoConfig = {
  clientId: 'demo-google-client-id.apps.googleusercontent.com',
  redirectUri: window.location.origin,
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
};

// Google OAuth endpoints
export const googleEndpoints = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
};

// Generate Google OAuth URL
export const generateGoogleAuthUrl = (config) => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: config.responseType,
    access_type: config.accessType,
    prompt: config.prompt
  });

  return `${googleEndpoints.authUrl}?${params.toString()}`;
};

// Exchange authorization code for tokens (simulated for demo)
export const exchangeCodeForTokens = async (code) => {
  // In production, this would make a real API call to Google's token endpoint
  // For demo purposes, we'll simulate the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        access_token: 'demo_access_token_' + Date.now(),
        refresh_token: 'demo_refresh_token_' + Date.now(),
        expires_in: 3600,
        token_type: 'Bearer'
      });
    }, 1000);
  });
};

// Get user info from Google (simulated for demo)
export const getGoogleUserInfo = async (accessToken) => {
  // In production, this would make a real API call to Google's userinfo endpoint
  // For demo purposes, we'll simulate the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '123456789',
        email: 'user@gmail.com',
        name: 'Demo User',
        picture: 'https://picsum.photos/seed/demo-user/200/200.jpg',
        given_name: 'Demo',
        family_name: 'User',
        verified_email: true
      });
    }, 1000);
  });
};
