import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './admin-auth';
import { useOrders } from './useFirebaseData';

export default function AdminOrders() {
  const { admin, hasPermission } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/');
    }
  }, [admin, navigate]);

  const { orders, loading } = useOrders();

  const getStatusBadge = (status) => {
    const colors = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'secondary'
    };
    return colors[status?.toLowerCase()] || 'secondary';
  };

  return (
    <div className="admin-dashboard">
      <nav className="pm-nav">
        <div className="pm-nav-content">
          <div className="pm-nav-brand">
            <Link to="/admin/dashboard" className="pm-nav-link">
              <span className="pm-nav-icon">🏠</span>
              Dashboard
            </Link>
          </div>
          
          <div className="pm-nav-menu">
            <Link to="/admin/products" className="pm-nav-link">
              <span className="pm-nav-icon">📦</span>
              Products
            </Link>
            <Link to="/admin/orders" className="pm-nav-link pm-nav-active">
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

      <header className="pm-header">
        <div className="pm-header-content">
          <div className="pm-title">
            <h1>Orders</h1>
            <p>Manage store orders and shipments.</p>
          </div>
        </div>
      </header>

      <div className="pm-main-content" style={{ marginTop: '2rem' }}>
        <div className="pm-card">
          <div className="pm-card-content">
            {loading ? (
              <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ marginTop: '1rem', color: '#64748b' }}>No orders found.</p>
            ) : (
              <div className="pm-table-container">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      {hasPermission('manage_sales') && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <tr key={order.id} className="pm-table-row">
                          <td>
                            <span className="pm-order-id" title={order.id}>
                              {order.id.split('-').pop()}
                            </span>
                          </td>
                          <td>
                            <div className="pm-customer-info">
                               <span style={{fontWeight: 500}}>{order.shippingAddress?.fullName}</span>
                               <span style={{fontSize: '0.75rem', color: '#64748b'}}>{order.customerEmail}</span>
                            </div>
                          </td>
                          <td>{orderDate}</td>
                          <td>{order.items?.length || 0}</td>
                          <td>
                            <span className="pm-price">₹{order.total?.toLocaleString()}</span>
                          </td>
                          <td>
                            <span className={`pm-status-badge pm-status-${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          {hasPermission('manage_sales') && (
                            <td>
                              <button className="pm-action-btn pm-edit-btn" onClick={() => alert('Order status updates coming soon!')}>Update</button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .pm-nav { background: white; border-bottom: 1px solid #e5e7eb; padding: 0 2rem; position: sticky; top: 0; z-index: 100; }
        .pm-nav-content { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }
        .pm-nav-brand { display: flex; align-items: center; }
        .pm-nav-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; text-decoration: none; color: #6b7280; border-radius: 0.5rem; transition: all 0.2s; font-weight: 500; }
        .pm-nav-link:hover { background: #f3f4f6; color: #1e293b; }
        .pm-nav-active { background: #3b82f6; color: white; }
        .pm-nav-icon { font-size: 1rem; }
        .pm-nav-menu { display: flex; gap: 0.5rem; }
        .pm-nav-user { display: flex; align-items: center; gap: 1rem; }
        .pm-nav-user-info { display: flex; align-items: center; gap: 0.5rem; }
        .pm-nav-user-avatar { width: 2rem; height: 2rem; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: white; }
        .pm-nav-user-name { font-weight: 500; color: #374151; }
        .pm-nav-logout { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }
        .pm-nav-logout:hover { background: #dc2626; }
        .pm-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 1.5rem 2rem; }
        .pm-header-content { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }
        .pm-title h1 { font-size: 2rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
        .pm-title p { color: #64748b; font-size: 1rem; }
        .pm-card { background: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
        .pm-card-content { padding: 1.5rem; }
        .pm-main-content { padding: 0 2rem 2rem; max-width: 1400px; margin: 0 auto; }
        .pm-table-container { overflow-x: auto; }
        .pm-table { width: 100%; border-collapse: collapse; }
        .pm-table th { background: #f8fafc; padding: 0.75rem; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; font-size: 0.875rem; }
        .pm-table td { padding: 0.75rem; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; }
        .pm-table-row:hover { background: #f8fafc; }
        .pm-order-id { font-family: monospace; background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; }
        .pm-status-badge { padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
        .pm-status-success { background: #dcfce7; color: #166534; }
        .pm-status-info { background: #dbeafe; color: #1e40af; }
        .pm-status-warning { background: #fef3c7; color: #92400e; }
        .pm-status-secondary { background: #f3f4f6; color: #6b7280; }
        .pm-price { font-weight: 700; color: #1e293b; }
        .pm-customer-info { display: flex; flex-direction: column; gap: 0.1rem; }
        .pm-action-btn { background: #f1f5f9; color: #374151; border: none; padding: 0.35rem 0.75rem; border-radius: 0.35rem; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .pm-action-btn:hover { background: #e2e8f0; }
        @media (max-width: 768px) {
          .pm-nav, .pm-header, .pm-main-content { padding: 1rem; }
          .pm-nav-content { flex-direction: column; gap: 1rem; align-items: stretch; }
          .pm-nav-menu { flex-wrap: wrap; justify-content: center; }
          .pm-nav-user { justify-content: space-between; width: 100%; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
        }
      `}</style>
    </div>
  );
}
