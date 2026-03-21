import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';

const fallbackProducts = [
  {
    id: 'frostline-fridge',
    name: 'Frostline Smart Fridge',
    description: 'Counter-depth cooling with adaptive humidity drawers.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1584243027496-9645097a0054?w=800&h=600&fit=crop',
    category: 'Cold Storage',
    brand: 'Frostline',
    inStock: true
  },
  {
    id: 'airstream-ac',
    name: 'Airstream Climate System',
    description: 'Whisper-quiet climate control for modern spaces.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop',
    category: 'Climate Control',
    brand: 'Airstream',
    inStock: true
  },
  {
    id: 'silkguard-washer',
    name: 'Silkguard Washer',
    description: 'Precision fabric care with steam sanitization.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    category: 'Fabric Care',
    brand: 'Silkguard',
    inStock: true
  },
  {
    id: 'cinema-view-oled',
    name: 'CinemaView OLED',
    description: 'Ultra-thin 65" display with cinematic clarity.',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1596786350986-224a6375b5fa?w=800&h=600&fit=crop',
    category: 'Visual Arts',
    brand: 'CinemaView',
    inStock: true
  }
];

export default function Cart() {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('patelElectronicsCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('patelElectronicsCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(0.1);
      alert('Promo code applied! 10% discount.');
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setDiscount(0.2);
      alert('Promo code applied! 20% discount.');
    } else {
      alert('Invalid promo code. Try SAVE10 or WELCOME20');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 45 : 0;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmount;

  const getProductDetails = (productId) => {
    return fallbackProducts.find(p => p.id === productId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Proceeding to checkout...');
    // In a real app, this would navigate to a checkout page
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
          <Link to="/cart" className="text-button active">
            Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </Link>
          {isAuthenticated ? (
            <Link to="/profile" className="text-button">Profile</Link>
          ) : (
            <Link to="/login" className="text-button">Sign In</Link>
          )}
        </nav>
      </header>

      <div className="cart-container">
        <section className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </section>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => {
                const product = getProductDetails(item.id);
                return (
                  <article key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={product?.image} alt={product?.name} />
                    </div>
                    
                    <div className="item-details">
                      <h3>{product?.name}</h3>
                      <p className="item-brand">{product?.brand}</p>
                      <p className="item-category">{product?.category}</p>
                      <p className="item-description">{product?.description}</p>
                      <p className="item-price">${product?.price.toLocaleString()}</p>
                    </div>

                    <div className="item-quantity">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-total">
                      <p className="total-label">Total:</p>
                      <p className="total-price">${(product?.price * item.quantity).toLocaleString()}</p>
                      <button 
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="cart-sidebar">
              <div className="order-summary">
                <h2>Order Summary</h2>
                
                <div className="summary-line">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                
                <div className="summary-line">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="summary-line discount">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="promo-code">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={applyPromoCode}>Apply</button>
                </div>

                <button className="primary checkout-button" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                
                <Link to="/" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>

              <div className="cart-actions">
                <button className="ghost" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .cart-header {
          margin-bottom: 3rem;
        }

        .cart-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .cart-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--white);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(21, 19, 15, 0.1);
        }

        .empty-cart-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
        }

        .empty-cart h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .empty-cart p {
          color: #666;
          margin-bottom: 2rem;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-item {
          background: var(--white);
          border-radius: 16px;
          padding: 2rem;
          display: grid;
          grid-template-columns: 120px 1fr auto auto;
          gap: 2rem;
          align-items: center;
          box-shadow: 0 5px 15px rgba(21, 19, 15, 0.08);
          border: 1px solid var(--soft);
        }

        .item-image img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-details h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .item-brand {
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .item-category {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .item-description {
          color: #4c453d;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .item-price {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--dark);
        }

        .item-quantity {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .item-quantity label {
          font-size: 0.9rem;
          color: #666;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--cream);
          border-radius: 8px;
          padding: 0.25rem;
        }

        .quantity-controls button {
          width: 30px;
          height: 30px;
          border: none;
          background: var(--white);
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .quantity-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-controls span {
          min-width: 30px;
          text-align: center;
          font-weight: 500;
        }

        .item-total {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .total-label {
          font-size: 0.9rem;
          color: #666;
        }

        .total-price {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--dark);
        }

        .remove-button {
          background: none;
          border: none;
          color: #b12704;
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        .remove-button:hover {
          color: #8a1f03;
        }

        .cart-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .order-summary {
          background: var(--white);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(21, 19, 15, 0.08);
          border: 1px solid var(--soft);
        }

        .order-summary h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--dark);
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--soft);
        }

        .summary-line.discount {
          color: #008000;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-top: 2px solid var(--dark);
          font-weight: 600;
          font-size: 1.2rem;
          margin-top: 0.5rem;
        }

        .promo-code {
          display: flex;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .promo-code input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--soft);
          border-radius: 8px;
        }

        .promo-code button {
          padding: 0.75rem 1rem;
          background: var(--dark);
          color: var(--cream);
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .checkout-button {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .continue-shopping {
          display: block;
          text-align: center;
          color: var(--accent);
          text-decoration: none;
          padding: 0.75rem;
        }

        .continue-shopping:hover {
          text-decoration: underline;
        }

        .cart-actions {
          text-align: center;
        }

        .cart-actions button {
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--soft);
          background: var(--white);
          border-radius: 8px;
          cursor: pointer;
        }

        .cart-actions button:hover {
          background: var(--cream);
        }

        @media (max-width: 1024px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-sidebar {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 1rem;
          }

          .item-image {
            grid-row: span 2;
          }

          .item-quantity,
          .item-total {
            grid-column: 2;
          }

          .quantity-controls {
            justify-self: start;
          }
        }
      `}</style>
    </div>
  );
}
