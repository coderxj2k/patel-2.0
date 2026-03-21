import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      await loginWithEmail(email, password);
    }
  };

  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand">
          <Link to="/">Patel Electronics</Link>
        </div>
        <nav className="top-actions">
          <Link to="/stores" className="text-button">Stores</Link>
          <Link to="/support" className="text-button">Support</Link>
          <Link to="/cart" className="text-button">Cart</Link>
        </nav>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
            <p>
              {isLoginMode 
                ? 'Sign in to access your account and continue shopping' 
                : 'Join Patel Electronics for exclusive deals and personalized service'
              }
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <p>Authentication error: {error.message}</p>
            </div>
          )}

          <div className="auth-methods">
            <div className="auth-divider">
              <span>Quick Access</span>
            </div>

            <div className="auth-buttons">
              <button 
                className="auth-button primary google"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Continue with Google'}
              </button>

              <div className="social-auth">
                <button className="social-button google" onClick={handleGoogleLogin} disabled={isLoading}>
                  <span className="social-icon">�</span>
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="auth-divider">
              <span>Or continue with email</span>
            </div>

            <form className="auth-form" onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isLoginMode && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" className="auth-button submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : isLoginMode ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  className="switch-button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                >
                  {isLoginMode ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>

          <div className="auth-benefits">
            <h3>Why Join Patel Electronics?</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <span className="benefit-icon">🚚</span>
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders over $50</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💎</span>
                <div>
                  <h4>Member Rewards</h4>
                  <p>Earn points on every purchase</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔔</span>
                <div>
                  <h4>Early Access</h4>
                  <p>New products and sales</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎁</span>
                <div>
                  <h4>Birthday Bonus</h4>
                  <p>Special discount on your birthday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
        }

        .auth-card {
          background: var(--white);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(21, 19, 15, 0.15);
          max-width: 500px;
          width: 100%;
          padding: 3rem;
          border: 1px solid var(--soft);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .auth-header p {
          color: #666;
          line-height: 1.6;
        }

        .auth-error {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          color: #c33;
        }

        .auth-methods {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #999;
          font-size: 0.9rem;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--soft);
        }

        .auth-divider span {
          padding: 0 1rem;
        }

        .auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-button {
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-button.primary.google {
          background: #4285f4;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .auth-button.primary.google:hover {
          background: #357ae8;
        }

        .social-button.google {
          border-color: #4285f4;
          color: #4285f4;
        }

        .social-button.google:hover {
          background: #f8f9fa;
        }

        .auth-button.submit {
          background: var(--accent);
          color: var(--white);
          width: 100%;
        }

        .auth-button.submit:hover {
          background: #a67c52;
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .social-auth {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid var(--soft);
          border-radius: 8px;
          background: var(--white);
          cursor: pointer;
          transition: all 0.2s;
        }

        .social-button:hover {
          background: var(--cream);
        }

        .social-icon {
          font-size: 1.2rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: var(--dark);
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid var(--soft);
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .forgot-link {
          color: var(--accent);
          text-decoration: none;
          font-size: 0.9rem;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .auth-switch {
          text-align: center;
          padding-top: 1rem;
        }

        .auth-switch p {
          color: #666;
        }

        .switch-button {
          background: none;
          border: none;
          color: var(--accent);
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          margin-left: 0.5rem;
        }

        .auth-benefits {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--soft);
        }

        .auth-benefits h3 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: var(--dark);
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .benefit-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          border-radius: 8px;
        }

        .benefit-item h4 {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          color: var(--dark);
        }

        .benefit-item p {
          font-size: 0.8rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .auth-card {
            padding: 2rem 1.5rem;
          }

          .auth-header h1 {
            font-size: 2rem;
          }

          .social-auth {
            grid-template-columns: 1fr;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
