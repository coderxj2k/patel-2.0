import { useAuth } from './auth-context.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load user data from localStorage or API
    if (isAuthenticated) {
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
      const savedWishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]');
      
      setOrders(savedOrders);
      setAddresses(savedAddresses);
      setWishlist(savedWishlist);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddress = () => {
    const newAddress = {
      id: Date.now(),
      type: 'Home',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 9876543210'
    };
    setAddresses([...addresses, newAddress]);
    localStorage.setItem('userAddresses', JSON.stringify([...addresses, newAddress]));
  };

  const handleRemoveAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
            <Link to="/login" className="text-button">Sign In</Link>
          </nav>
        </header>

        <div className="auth-required">
          <div className="auth-required-card">
            <h2>Please Sign In</h2>
            <p>You need to be signed in to view your profile.</p>
            <Link to="/login" className="primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

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
          <button className="text-button" onClick={handleLogout}>Sign Out</button>
        </nav>
      </header>

      <div className="profile-container">
        <div className="profile-header">
          <div className="user-info">
            <div className="user-avatar">
              <img src={user.picture} alt={user.name} />
            </div>
            <div className="user-details">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <span className="member-badge">Premium Member</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="primary">Edit Profile</button>
            <button className="ghost" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </button>
          <button 
            className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
                <div className="stat-card">
                  <h3>{wishlist.length}</h3>
                  <p>Wishlist Items</p>
                </div>
                <div className="stat-card">
                  <h3>{addresses.length}</h3>
                  <p>Saved Addresses</p>
                </div>
                <div className="stat-card">
                  <h3>2,450</h3>
                  <p>Reward Points</p>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">📦</span>
                    <div>
                      <h4>Order #12345</h4>
                      <p>Frostline Smart Fridge - Delivered</p>
                    </div>
                    <span className="activity-date">2 days ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">❤️</span>
                    <div>
                      <h4>Added to Wishlist</h4>
                      <p>CinemaView OLED TV</p>
                    </div>
                    <span className="activity-date">1 week ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">⭐</span>
                    <div>
                      <h4>Review Submitted</h4>
                      <p>Silkguard Washer - 5 stars</p>
                    </div>
                    <span className="activity-date">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <h2>Order History</h2>
                <button className="primary">Track New Order</button>
              </div>
              
              {orders.length === 0 ? (
                <div className="empty-state">
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your order history here.</p>
                  <Link to="/" className="primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Order #{order.id}</h3>
                          <p>Placed on {order.date}</p>
                        </div>
                        <span className={`order-status ${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                              <h4>{item.name}</h4>
                              <p>Qty: {item.quantity}</p>
                            </div>
                            <span>${item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <span className="order-total">Total: ${order.total}</span>
                        <button className="ghost">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <div className="section-header">
                <h2>Saved Addresses</h2>
                <button className="primary" onClick={handleAddAddress}>Add Address</button>
              </div>
              
              <div className="addresses-list">
                {addresses.map((address) => (
                  <div key={address.id} className="address-card">
                    <div className="address-header">
                      <h3>{address.type}</h3>
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveAddress(address.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="address-details">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <div className="section-header">
                <h2>My Wishlist</h2>
                <p>{wishlist.length} items</p>
              </div>
              
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <h3>Your wishlist is empty</h3>
                  <p>Add items you love to your wishlist and never miss out!</p>
                  <Link to="/" className="primary">Browse Products</Link>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map((item) => (
                    <div key={item.id} className="wishlist-item">
                      <img src={item.image} alt={item.name} />
                      <div className="wishlist-item-info">
                        <h3>{item.name}</h3>
                        <p>${item.price}</p>
                      </div>
                      <div className="wishlist-item-actions">
                        <button className="primary">Add to Cart</button>
                        <button className="ghost">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              
              <div className="settings-groups">
                <div className="settings-group">
                  <h3>Personal Information</h3>
                  <div className="setting-item">
                    <label>Full Name</label>
                    <input type="text" defaultValue={user.name} />
                  </div>
                  <div className="setting-item">
                    <label>Email</label>
                    <input type="email" defaultValue={user.email} disabled />
                  </div>
                  <div className="setting-item">
                    <label>Phone</label>
                    <input type="tel" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="settings-group">
                  <h3>Preferences</h3>
                  <div className="setting-item">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Email notifications for orders</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Promotional emails and offers</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>

                <div className="settings-group">
                  <h3>Security</h3>
                  <button className="ghost">Change Password</button>
                  <button className="ghost">Enable Two-Factor Authentication</button>
                </div>

                <div className="settings-actions">
                  <button className="primary">Save Changes</button>
                  <button className="ghost danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(21, 19, 15, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .user-details p {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .member-badge {
          background: var(--accent);
          color: var(--white);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .profile-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--soft);
        }

        .tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
            border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }

        .tab:hover {
          color: var(--accent);
        }

        .profile-content {
          background: var(--white);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(21, 19, 15, 0.1);
        }

        .overview-section {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--cream);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .stat-card h3 {
          font-size: 2rem;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .stat-card p {
          color: #666;
        }

        .recent-activity h2 {
          margin-bottom: 1.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          background: var(--cream);
        }

        .activity-icon {
          font-size: 1.5rem;
        }

        .activity-item h4 {
          margin-bottom: 0.25rem;
        }

        .activity-item p {
          color: #666;
          font-size: 0.9rem;
        }

        .activity-date {
          margin-left: auto;
          color: #999;
          font-size: 0.8rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .empty-state h3 {
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 2rem;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          border: 1px solid var(--soft);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .order-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .order-status.delivered {
          background: #d4edda;
          color: #155724;
        }

        .order-status.processing {
          background: #fff3cd;
          color: #856404;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .order-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--soft);
        }

        .addresses-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .address-card {
          border: 1px solid var(--soft);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .address-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .remove-button {
          background: none;
          border: none;
          color: #b12704;
          cursor: pointer;
          text-decoration: underline;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .wishlist-item {
          border: 1px solid var(--soft);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .wishlist-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .wishlist-item-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .wishlist-item-actions button {
          flex: 1;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .settings-groups {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-group {
          border: 1px solid var(--soft);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .settings-group h3 {
          margin-bottom: 1rem;
        }

        .setting-item {
          margin-bottom: 1rem;
        }

        .setting-item input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--soft);
          border-radius: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .settings-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .danger {
          color: #b12704;
          border-color: #b12704;
        }

        .danger:hover {
          background: #fee;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--soft);
          border-top: 4px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-required {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
        }

        .auth-required-card {
          background: var(--white);
          padding: 3rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(21, 19, 15, 0.1);
        }

        .auth-required-card h2 {
          margin-bottom: 1rem;
        }

        .auth-required-card p {
          color: #666;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .profile-tabs {
            overflow-x: auto;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .addresses-list {
            grid-template-columns: 1fr;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
