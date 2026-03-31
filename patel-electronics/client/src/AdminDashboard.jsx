import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './admin-auth';
import { useProducts, useOrders } from './useFirebaseData';

export default function AdminDashboard() {
  const { admin, logout, hasPermission } = useAdminAuth();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [salesData, setSalesData] = useState([]);
  const { orders } = useOrders();
  const [customers, setCustomers] = useState([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);



  useEffect(() => {
    if (!admin) {
      navigate('/');
      return;
    }

    // Load demo data
    loadDashboardData();
  }, [admin, navigate]);

  const loadDashboardData = () => {
    // Demo sales data
    const demoSales = [
      { id: 1, date: '2024-03-20', amount: 107817, product: 'Frostline Smart Fridge', customer: 'John Doe' },
      { id: 2, date: '2024-03-20', amount: 74617, product: 'Silkguard Washer', customer: 'Jane Smith' },
      { id: 3, date: '2024-03-19', amount: 132717, product: 'CinemaView OLED TV', customer: 'Mike Johnson' },
      { id: 4, date: '2024-03-19', amount: 58017, product: 'AirPure Pro', customer: 'Sarah Williams' },
      { id: 5, date: '2024-03-18', amount: 41417, product: 'PowerStation Elite', customer: 'Tom Brown' }
    ];

    // Demo customers
    const demoCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 323451 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 2, totalSpent: 149234 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 1, totalSpent: 132717 },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', orders: 4, totalSpent: 232068 }
    ];

    setSalesData(demoSales);
    setCustomers(demoCustomers);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'secondary'
    };
    return colors[status] || 'secondary';
  };

  return (
    <div className="admin-dashboard">
      {/* Navigation Bar */}
      <nav className="pm-nav">
        <div className="pm-nav-content">
          <div className="pm-nav-brand">
            <Link to="/admin/dashboard" className="pm-nav-link pm-nav-active">
              <span className="pm-nav-icon">🏠</span>
              Dashboard
            </Link>
          </div>
          
          <div className="pm-nav-menu">
            <Link to="/admin/products" className="pm-nav-link">
              <span className="pm-nav-icon">📦</span>
              Products
            </Link>
            <Link to="/admin/orders" className="pm-nav-link">
              <span className="pm-nav-icon">📋</span>
              Orders
            </Link>
            <Link to="/admin/customers" className="pm-nav-link">
              <span className="pm-nav-icon">👥</span>
              Customers
            </Link>
            <Link to="/admin/analytics" className="pm-nav-link">
              <span className="pm-nav-icon">📊</span>
              Analytics
            </Link>
          </div>

          <div className="pm-nav-user">
            <span className="pm-nav-user-info">
              <span className="pm-nav-user-avatar">👤</span>
              <span className="pm-nav-user-name">{admin?.name || 'Admin'}</span>
            </span>
            <button 
              className="pm-nav-logout"
              onClick={() => navigate('/')}
            >
              <span className="pm-nav-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pm-header">
        <div className="pm-header-content">
          <div className="pm-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="pm-actions">
            {hasPermission('manage_products') && (
              <button className="pm-btn pm-btn-primary" onClick={() => navigate('/admin/products')}>
                <span className="pm-nav-icon" style={{marginRight: '8px'}}>📦</span>
                Manage Products
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="pm-stats">
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>💰</span>
          </div>
          <div className="pm-stat-content">
            <h3>₹{salesData.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>📦</span>
          </div>
          <div className="pm-stat-content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>👥</span>
          </div>
          <div className="pm-stat-content">
            <h3>{customers.length}</h3>
            <p>Customers</p>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>📊</span>
          </div>
          <div className="pm-stat-content">
            <h3>{products.length}</h3>
            <p>Products</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pm-main-content">
        <div className="pm-content-grid">
          {/* Recent Orders */}
          <div className="pm-card">
            <div className="pm-card-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="pm-card-link">View All</Link>
            </div>
            <div className="pm-card-content">
              <div className="pm-table-container">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => {
                      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <tr key={order.id} className="pm-table-row">
                          <td>
                            <span className="pm-order-id" title={order.id}>
                              {order.id.split('-').pop()}
                            </span>
                          </td>
                          <td>{order.shippingAddress?.fullName || 'Unknown'}</td>
                          <td>{orderDate}</td>
                          <td>
                            <span className={`pm-status-badge pm-status-${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <span className="pm-price">₹{order.total?.toLocaleString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="pm-card">
            <div className="pm-card-header">
              <h2>Top Products</h2>
              <Link to="/admin/products" className="pm-card-link">View All</Link>
            </div>
            <div className="pm-card-content">
              <div className="pm-table-container">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="pm-table-row">
                        <td>{product.name}</td>
                        <td>
                          <span className="pm-category-badge">{product.category}</span>
                        </td>
                        <td>
                          <span className={`pm-stock-badge ${product.inStock ? 'in-stock' : 'low-stock'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <span className="pm-price">₹{product.price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="pm-card">
            <div className="pm-card-header">
              <h2>Recent Customers</h2>
              <Link to="/admin/customers" className="pm-card-link">View All</Link>
            </div>
            <div className="pm-card-content">
              <div className="pm-table-container">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.slice(0, 5).map((customer) => (
                      <tr key={customer.id} className="pm-table-row">
                        <td>
                          <div className="pm-customer-info">
                            <span className="pm-customer-avatar">👤</span>
                            <span>{customer.name}</span>
                          </div>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.orders}</td>
                        <td>
                          <span className="pm-price">₹{customer.totalSpent}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="pm-card">
            <div className="pm-card-header">
              <h2>Sales Overview</h2>
              <Link to="/admin/analytics" className="pm-card-link">View Analytics</Link>
            </div>
            <div className="pm-card-content">
              <div className="pm-chart-container">
                <div className="pm-chart-placeholder">
                  <div className="pm-chart-bars">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const height = Math.random() * 60 + 20;
                      return (
                        <div key={day} className="pm-chart-bar-container">
                          <div 
                            className="pm-chart-bar" 
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="pm-chart-label">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pm-chart-legend">
                    <span className="pm-chart-title">Weekly Sales</span>
                    <span className="pm-chart-value">₹{(Math.random() * 10000 + 5000).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="pm-modal-overlay">
          <div className="pm-modal">
            <div className="pm-modal-header">
              <h2>Access Denied</h2>
              <button className="pm-modal-close" onClick={() => setShowPermissionModal(false)}>×</button>
            </div>
            <div className="pm-modal-content">
              <div className="pm-error-icon-large">🔒</div>
              <p className="pm-modal-message">to edit and manage the products login to admin account</p>
            </div>
            <div className="pm-modal-actions">
              <button className="pm-btn pm-btn-secondary" onClick={() => setShowPermissionModal(false)}>
                Cancel
              </button>
              <button className="pm-btn pm-btn-primary" onClick={() => {
                setShowPermissionModal(false);
                logout();
                navigate('/');
              }}>
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Navigation Bar */
        .pm-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .pm-nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pm-nav-brand {
          display: flex;
          align-items: center;
        }

        .pm-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #6b7280;
          border-radius: 0.5rem;
          transition: all 0.2s;
          font-weight: 500;
        }

        .pm-nav-link:hover {
          background: #f3f4f6;
          color: #1e293b;
        }

        .pm-nav-active {
          background: #3b82f6;
          color: white;
        }

        .pm-nav-icon {
          font-size: 1rem;
        }

        .pm-nav-menu {
          display: flex;
          gap: 0.5rem;
        }

        .pm-nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pm-nav-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pm-nav-user-avatar {
          width: 2rem;
          height: 2rem;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .pm-nav-user-name {
          font-weight: 500;
          color: #374151;
        }

        .pm-nav-logout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .pm-nav-logout:hover {
          background: #dc2626;
        }

        /* Header */
        .pm-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem 2rem;
        }

        .pm-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pm-title h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .pm-title p {
          color: #64748b;
          font-size: 1rem;
        }

        .pm-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pm-btn-primary {
          background: #3b82f6;
          color: white;
        }

        .pm-btn-primary:hover {
          background: #2563eb;
        }

        .pm-btn-icon {
          font-size: 1.25rem;
        }

        /* Stats */
        .pm-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pm-stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pm-stat-icon {
          width: 3rem;
          height: 3rem;
          background: #f1f5f9;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .pm-stat-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .pm-stat-content p {
          color: #64748b;
          font-size: 0.875rem;
        }

        /* Main Content */
        .pm-main-content {
          padding: 0 2rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pm-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .pm-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .pm-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .pm-card-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .pm-card-link {
          color: #3b82f6;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .pm-card-link:hover {
          color: #2563eb;
        }

        .pm-card-content {
          padding: 1.5rem;
        }

        .pm-table-container {
          overflow-x: auto;
        }

        .pm-table {
          width: 100%;
          border-collapse: collapse;
        }

        .pm-table th {
          background: #f8fafc;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.875rem;
        }

        .pm-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.875rem;
        }

        .pm-table-row:hover {
          background: #f8fafc;
        }

        .pm-order-id {
          font-family: monospace;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        .pm-status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .pm-status-success {
          background: #dcfce7;
          color: #166534;
        }

        .pm-status-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .pm-status-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .pm-status-secondary {
          background: #f3f4f6;
          color: #6b7280;
        }

        .pm-category-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .pm-stock-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .pm-stock-badge.in-stock {
          background: #dcfce7;
          color: #166534;
        }

        .pm-stock-badge.low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .pm-price {
          font-weight: 700;
          color: #1e293b;
        }

        .pm-customer-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pm-customer-avatar {
          width: 1.5rem;
          height: 1.5rem;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        /* Chart */
        .pm-chart-container {
          height: 200px;
        }

        .pm-chart-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .pm-chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 150px;
          gap: 0.5rem;
        }

        .pm-chart-bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .pm-chart-bar {
          width: 100%;
          background: linear-gradient(to top, #3b82f6, #60a5fa);
          border-radius: 0.25rem 0.25rem 0 0;
          min-height: 20px;
        }

        .pm-chart-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .pm-chart-legend {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .pm-chart-title {
          font-weight: 600;
          color: #374151;
        }

        .pm-chart-value {
          font-weight: 700;
          color: #1e293b;
        }

        @media (max-width: 768px) {
          .pm-nav-content {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .pm-nav-menu {
            flex-wrap: wrap;
          }

          .pm-header, .pm-main-content, .pm-stats, .pm-nav {
            padding: 1rem;
          }

          .pm-header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .pm-stats {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .pm-content-grid {
            grid-template-columns: 1fr;
          }

          .pm-btn {
            width: 100%;
            justify-content: center;
          }
        }
        
        /* Modal Styles */
        .pm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .pm-modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pm-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .pm-modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .pm-modal-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .pm-modal-close:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .pm-modal-content {
          padding: 2rem 1.5rem;
          text-align: center;
        }
        
        .pm-error-icon-large {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .pm-modal-message {
          font-size: 1.1rem;
          color: #374151;
          margin: 0;
        }

        .pm-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          border-radius: 0 0 12px 12px;
        }
        
        .pm-btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .pm-btn-secondary:hover {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}
