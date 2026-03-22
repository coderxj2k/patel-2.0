import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';
import { useCart } from './cart-context.jsx';
import { createOrder } from './useFirebaseData';

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, getCartItemCount, subtotal, shipping, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      navigate('/cart');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerId: user.uid || user.id || user.sub,
      customerEmail: user.email,
      shippingAddress: formData,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.images?.[0] || ''
      })),
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: 'COD', // Cash On Delivery Only
      status: 'pending' // Order status lifecycle
    };

    const result = await createOrder(orderData);
    
    if (result.success) {
      clearCart();
      navigate('/order-confirmation', { state: { status: 'success', orderId: result.orderId } });
    } else {
      console.error(result.error);
      navigate('/order-confirmation', { state: { status: 'failed', error: result.error } });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <header className="top-bar">
        <div className="brand">
          <Link to="/">Patel Electronics</Link>
        </div>
        <nav className="top-actions">
          <Link to="/stores" className="text-button">Stores</Link>
          <Link to="/support" className="text-button">Support</Link>
          <Link to="/cart" className="text-button">Cart ({getCartItemCount()})</Link>
        </nav>
      </header>

      <div className="checkout-page-container">
        <div className="checkout-grid">
          {/* Shipping Form */}
          <div className="checkout-form-section">
            <h2>Secure Checkout</h2>
            <p className="subtitle">Please provide your shipping details.</p>

            <form className="payment-form" onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label>Delivery Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="123 Main St, Apt 4B" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="New York" />
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required placeholder="NY" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} required placeholder="10001" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(555) 123-4567" />
                </div>
              </div>

              <div className="payment-method-banner">
                <div className="payment-icon">🚚</div>
                <div className="payment-text">
                  <strong>Cash on Delivery (COD)</strong>
                  <span>Pay upon receiving your order. Only available method.</span>
                </div>
                <div className="payment-check">✓</div>
              </div>

              <button className="primary submit-order-btn" type="submit" disabled={isSubmitting || cartItems.length === 0}>
                {isSubmitting ? 'Processing Order...' : `Place Order • $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">
            <div className="checkout-card">
              <h3>Order Summary</h3>
              <div className="cart-item-preview">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image || item.images?.[0]} alt={item.name} />
                    <div className="summary-item-info">
                      <span className="name">{item.name}</span>
                      <span className="qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="price">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>${shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-line">
                <span>Tax</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
        }

        .checkout-form-section h2 {
          font-size: 2.2rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.85rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.3);
          color: var(--text-main);
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .payment-method-banner {
          display: flex;
          align-items: center;
          background: var(--surface-glass);
          border: 1px solid var(--accent);
          padding: 1.25rem;
          border-radius: 12px;
          margin: 2rem 0;
          backdrop-filter: blur(12px);
        }

        .payment-icon {
          font-size: 1.8rem;
          margin-right: 1rem;
        }

        .payment-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .payment-text strong {
          color: var(--text-main);
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }

        .payment-text span {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .payment-check {
          color: var(--accent);
          font-size: 1.2rem;
          font-weight: bold;
        }

        .submit-order-btn {
          width: 100%;
          padding: 1.25rem;
          font-size: 1.1rem;
          border-radius: 100px;
          margin-top: 1rem;
        }

        .submit-order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Summary Panel styling heavily mimicking App.jsx .checkout-card but enhanced */
        .checkout-summary-section {
          position: sticky;
          top: 100px;
        }

        .checkout-card {
          background: var(--surface-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .checkout-card h3 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--text-main);
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        .cart-item-preview {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-height: 350px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .cart-item-preview::-webkit-scrollbar {
          width: 4px;
        }
        .cart-item-preview::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .summary-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .summary-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .summary-item-info .name {
          color: var(--text-main);
          font-size: 0.95rem;
          font-weight: 500;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .summary-item-info .qty {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 0.2rem;
        }

        .summary-item .price {
          color: var(--text-main);
          font-weight: 600;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: var(--text-muted);
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-main);
        }

        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .checkout-summary-section {
            order: -1;
            position: relative;
            top: 0;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
