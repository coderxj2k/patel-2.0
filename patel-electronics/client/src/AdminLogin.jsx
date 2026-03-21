import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './admin-auth';

export default function AdminLogin() {
  const { loginAsAdmin, isLoading, error } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await loginAsAdmin(email, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="admin-login">
      {/* Header */}
      <header className="pm-header">
        <div className="pm-header-content">
          <div className="pm-title">
            <Link to="/" className="pm-brand-link">Patel Electronics</Link>
          </div>
          <nav className="pm-nav-links">
            <Link to="/stores" className="pm-nav-link">Stores</Link>
            <Link to="/support" className="pm-nav-link">Support</Link>
            <Link to="/cart" className="pm-nav-link">Cart</Link>
            <Link to="/login" className="pm-nav-link">Customer Login</Link>
          </nav>
        </div>
      </header>

      {/* Login Container */}
      <div className="pm-login-container">
        <div className="pm-login-card">
          <div className="pm-login-header">
            <div className="pm-login-logo">
              <div className="pm-login-avatar">👨‍💼</div>
              <h1>Admin Portal</h1>
            </div>
            <p>Sign in to access the admin dashboard and management tools</p>
          </div>

          {error && (
            <div className="pm-error-message">
              <span className="pm-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="pm-login-form" onSubmit={handleSubmit}>
            <div className="pm-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="pm-input-group">
                <span className="pm-input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@patelelectronics.com"
                  required
                />
              </div>
            </div>

            <div className="pm-form-group">
              <label htmlFor="password">Password</label>
              <div className="pm-input-group">
                <span className="pm-input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="pm-login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="pm-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="pm-btn-icon">🔐</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="pm-login-footer">
            <div className="pm-demo-info">
              <h3>Demo Credentials</h3>
              <div className="pm-credentials">
                <div className="pm-credential-item">
                  <span className="pm-credential-label">Admin:</span>
                  <span className="pm-credential-value">admin@patelelectronics.com / admin123</span>
                </div>
                <div className="pm-credential-item">
                  <span className="pm-credential-label">Sales:</span>
                  <span className="pm-credential-value">sales@patelelectronics.com / sales123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Header */
        .pm-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem;
        }

        .pm-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pm-brand-link {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
        }

        .pm-nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .pm-nav-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .pm-nav-link:hover {
          color: white;
        }

        /* Login Container */
        .pm-login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
        }

        .pm-login-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 450px;
          overflow: hidden;
        }

        .pm-login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .pm-login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .pm-login-avatar {
          width: 4rem;
          height: 4rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .pm-login-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .pm-login-header p {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        .pm-error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #fef2f2;
          color: #dc2626;
          padding: 1rem;
          margin: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #fecaca;
        }

        .pm-error-icon {
          font-size: 1.25rem;
        }

        .pm-login-form {
          padding: 2rem;
        }

        .pm-form-group {
          margin-bottom: 1.5rem;
        }

        .pm-form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .pm-input-group {
          position: relative;
        }

        .pm-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 1rem;
        }

        .pm-input-group input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .pm-input-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .pm-login-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .pm-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .pm-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .pm-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pm-btn-icon {
          font-size: 1.25rem;
        }

        .pm-login-footer {
          background: #f8fafc;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .pm-demo-info h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pm-credentials {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pm-credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .pm-credential-label {
          font-weight: 600;
          color: #374151;
        }

        .pm-credential-value {
          color: #6b7280;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .pm-header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .pm-nav-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .pm-login-container {
            padding: 1rem;
          }

          .pm-login-card {
            max-width: 100%;
          }

          .pm-login-header {
            padding: 2rem 1.5rem;
          }

          .pm-login-form {
            padding: 1.5rem;
          }

          .pm-credential-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
