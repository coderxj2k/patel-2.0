import { Link } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';
import { useUserOrders } from './useFirebaseData';
import { getApplianceImage } from './imageUtils';
import Navbar from './Navbar.jsx';

export default function UserOrders() {
  const { isAuthenticated, user } = useAuth();

  // Create a normalized fallback ID depending on auth provider (Firebase vs Custom)
  const userId = user?.uid || user?.id || user?.sub;

  // Fetch orders specific to the currently logged in user
  const { orders, loading } = useUserOrders(userId);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: 'rgba(255, 165, 0, 0.2)', text: '#ffb732' };
      case 'processing': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' };
      case 'shipped': return { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' };
      case 'delivered': return { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' };
      case 'cancelled': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' };
      default: return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' };
    }
  };

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0; // Cancelled or unknown
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <Navbar />

      <main className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track, return, or repurchase items from previous orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet. Start exploring our premium catalog!</p>
            <Link to="/products" className="primary start-shopping-btn">Explore Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusDesign = getStatusColor(order.status);
              const currentStep = getStatusStep(order.status);

              return (
                <div key={order.id} className="order-card">

                  {/* Order Header Meta Data */}
                  <div className="order-meta-header">
                    <div className="meta-blocks">
                      <div className="meta-block">
                        <span className="meta-label">ORDER PLACED</span>
                        <span className="meta-value">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">TOTAL</span>
                        <span className="meta-value">₹{order.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">SHIP TO</span>
                        <span className="meta-value address-tooltip">
                          {order.shippingAddress?.fullName}
                        </span>
                      </div>
                      <div className="meta-block">
                        <span className="meta-label">PAYMENT</span>
                        <span className="meta-value">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="order-actions-header">
                      <span className="meta-label">ORDER # {order.id.split('-').pop().toUpperCase()}</span>
                      <div className="header-links">
                        <a href="#" className="text-link">View Invoice</a>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Tracking Visualizer */}
                  {currentStep > 0 && order.status?.toLowerCase() !== 'cancelled' && (
                    <div className="order-tracker">
                      <div className="tracker-status-text" style={{ color: statusDesign.text }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <div className="progress-bar-container">
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Ordered</span>
                        </div>
                        <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Processing</span>
                        </div>
                        <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Shipped</span>
                        </div>
                        <div className={`progress-line ${currentStep >= 4 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {order.status?.toLowerCase() === 'cancelled' && (
                    <div className="order-tracker cancelled">
                      <div className="tracker-status-text" style={{ color: statusDesign.text }}>
                        Cancelled
                      </div>
                    </div>
                  )}

                  {/* Ordered Items List */}
                  <div className="order-items-list">
                    {order.items?.map((item, index) => (
                      <div key={index} className="ordered-item-row">
                        <div className="item-image">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => { e.target.src = getApplianceImage(item.category || 'Appliance', item.id); }}
                          />
                        </div>
                        <div className="item-details">
                          <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                          <div className="item-sold-by">Sold by: Patel Electronics</div>
                          <div className="item-price">
                            ₹{item.price?.toLocaleString()} <span className="item-qty">x {item.quantity}</span>
                          </div>

                          <div className="item-actions">
                            <button className="secondary-btn">Track Package</button>
                            <button className="ghost-btn">Return Item</button>
                          </div>
                        </div>
                        <div className="item-review-action">
                          <button className="write-review-btn">Write a product review</button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx>{`
        .orders-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .orders-header {
          margin-bottom: 2rem;
        }

        .orders-header h1 {
          font-size: 2.5rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .orders-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .empty-orders {
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
          margin-top: 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-orders h2 {
          font-size: 1.8rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .empty-orders p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .start-shopping-btn {
          display: inline-block;
          padding: 1rem 2rem;
          border-radius: 100px;
          text-decoration: none;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .order-card {
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .order-card:hover {
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .order-meta-header {
          display: flex;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.03);
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .meta-blocks {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .meta-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-value {
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .order-actions-header {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .text-link {
          color: var(--accent);
          text-decoration: none;
          font-size: 0.95rem;
        }

        .text-link:hover {
          text-decoration: underline;
        }

        .order-tracker {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .tracker-status-text {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 80%;
          margin: 0 auto;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .step-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--border);
          border: 4px solid var(--surface-glass);
          transition: background 0.3s;
        }

        .progress-step.active .step-dot {
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }

        .step-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          position: absolute;
          top: 25px;
          white-space: nowrap;
        }

        .progress-step.active .step-label {
          color: var(--text-main);
          font-weight: 500;
        }

        .progress-line {
          flex: 1;
          height: 4px;
          background: var(--border);
          margin: 0 -5px;
          z-index: 1;
          transition: background 0.3s;
        }

        .progress-line.active {
          background: var(--accent);
        }

        .order-items-list {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ordered-item-row {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 1.5rem;
        }

        .item-image {
          width: 100px;
          height: 100px;
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
        }

        .item-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .item-details {
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-size: 1.1rem;
          color: var(--accent);
          text-decoration: none;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .item-name:hover {
          text-decoration: underline;
        }

        .item-sold-by {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .item-price {
          font-weight: 600;
          color: var(--text-main);
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .item-qty {
          color: var(--text-muted);
          font-weight: normal;
          font-size: 0.95rem;
        }

        .item-actions {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }

        .secondary-btn {
          background: #ffd814;
          color: #0f1111;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .secondary-btn:hover {
          background: #f7ca00;
        }

        .ghost-btn {
          background: transparent;
          color: var(--text-main);
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .ghost-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        .item-review-action {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .write-review-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 2rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          min-width: 250px;
          transition: background 0.2s, border-color 0.2s;
        }

        .write-review-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .ordered-item-row {
            grid-template-columns: 80px 1fr;
            grid-template-rows: auto auto;
            gap: 1rem;
          }
          
          .item-image {
            width: 80px;
            height: 80px;
          }

          .item-review-action {
            grid-column: 1 / -1;
          }

          .write-review-btn {
            width: 100%;
            padding: 1rem;
          }

          .progress-bar-container {
            width: 100%;
          }

          .order-actions-header {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
