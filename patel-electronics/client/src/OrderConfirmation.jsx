import { useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function OrderConfirmation() {
  const location = useLocation();
  const { state } = location;

  // If user somehow navigated here without completing checkout, send them home
  if (!state) {
    return <Navigate to="/" />;
  }

  const { status, orderId, error } = state;
  const isSuccess = status === 'success';

  return (
    <div className="page confirmation-page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2" style={{ background: isSuccess ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)' }}></div>
      </div>

      <Navbar />

      <main className="confirmation-container">
        <div className="confirmation-card">
          {isSuccess ? (
            <>
              <div className="status-icon success">✓</div>
              <h1>Order Placed Successfully!</h1>
              <p className="subtitle">Thank you for shopping with Patel Electronics.</p>
              
              <div className="order-details-box">
                <div className="detail-row">
                  <span className="label">Order Number:</span>
                  <span className="value highlight">{orderId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">Cash on Delivery (COD)</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value status-badge pending">Processing</span>
                </div>
              </div>

              <div className="next-steps">
                <h3>What happens next?</h3>
                <p>We will review your order and begin processing it immediately. You will pay directly upon delivery. You can track your order status in your account dashboard at any time.</p>
              </div>

              <div className="action-buttons">
                <Link to="/my-orders" className="primary action-btn">Track Order</Link>
                <Link to="/products" className="ghost action-btn">Continue Shopping</Link>
              </div>
            </>
          ) : (
            <>
              <div className="status-icon error">!</div>
              <h1>Order Failed</h1>
              <p className="subtitle">We encountered an issue while processing your order.</p>

              <div className="error-box">
                <strong>Error Details:</strong>
                <p>{error || 'An unexpected error occurred. Please try again.'}</p>
                <p className="firebase-hint">If this is a "Missing or insufficient permissions" error, it means your Firebase Firestore security rules currently block write operations for orders. Please update your Firebase Rules.</p>
              </div>

              <div className="action-buttons">
                <Link to="/checkout" className="primary action-btn">Try Again</Link>
                <Link to="/cart" className="ghost action-btn">Return to Cart</Link>
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        .confirmation-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .confirmation-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          z-index: 10;
        }

        .confirmation-card {
          background: var(--surface-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 4rem 3rem;
          max-width: 600px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .status-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: bold;
          margin: 0 auto 1.5rem;
        }

        .status-icon.success {
          background: rgba(74, 222, 128, 0.15);
          color: #4ade80;
          border: 2px solid rgba(74, 222, 128, 0.4);
        }

        .status-icon.error {
          background: rgba(248, 113, 113, 0.15);
          color: #f87171;
          border: 2px solid rgba(248, 113, 113, 0.4);
        }

        .confirmation-card h1 {
          font-size: 2.2rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
        }

        .order-details-box {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          color: var(--text-muted);
        }

        .value {
          color: var(--text-main);
          font-weight: 500;
        }

        .value.highlight {
          color: var(--accent);
          font-family: monospace;
          font-size: 1.1rem;
        }

        .status-badge.pending {
          background: rgba(255, 165, 0, 0.2);
          color: #ffb732;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .next-steps {
          text-align: left;
          margin-bottom: 2.5rem;
        }

        .next-steps h3 {
          color: var(--text-main);
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .next-steps p {
          color: var(--text-muted);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .error-box {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2.5rem;
          text-align: left;
        }

        .error-box strong {
          color: #f87171;
          display: block;
          margin-bottom: 0.5rem;
        }

        .error-box p {
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .firebase-hint {
          margin-top: 1rem;
          font-size: 0.85rem !important;
          color: var(--text-muted) !important;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-btn {
          padding: 1rem 2rem;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          flex: 1;
        }

        .action-btn.primary {
          background: var(--accent);
          color: #000;
        }

        .action-btn.ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-main);
        }

        @media (max-width: 600px) {
          .confirmation-card {
            padding: 2.5rem 1.5rem;
          }
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
