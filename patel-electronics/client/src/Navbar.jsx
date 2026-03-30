import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';
import { useCart } from './cart-context.jsx';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const location = useLocation();

  const isActive = (path) => {
    // Basic exact match or subpath match for products
    if (path === '/' && location.pathname !== '/') return '';
    return location.pathname === path || location.pathname.startsWith(`${path}/`) ? 'active' : '';
  };

  return (
    <header className="top-bar">
      <div className="brand">
        <Link to="/">Patel Electronics</Link>
      </div>
      <nav className="top-actions">
        <Link to="/products" className={`text-button ${isActive('/products')}`}>Products</Link>
        <Link to="/stores" className={`text-button ${isActive('/stores')}`}>Stores</Link>
        <Link to="/support" className={`text-button ${isActive('/support')}`}>Support</Link>
        <Link to="/cart" className={`text-button ${isActive('/cart')}`}>
          Cart {getCartItemCount() > 0 ? `(${getCartItemCount()})` : ''}
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/my-orders" className={`text-button ${isActive('/my-orders')}`}>My Orders</Link>
            <Link to="/profile" className={`text-button ${isActive('/profile')}`}>Profile</Link>
          </>
        ) : (
          <Link to="/login" className={`text-button ${isActive('/login')}`}>Sign In</Link>
        )}
      </nav>
    </header>
  );
}
