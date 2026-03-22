import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import Store from './Store';
import Support from './Support';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import UserOrders from './UserOrders';
import Login from './Login';
import Profile from './Profile';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import ProductsPage from './ProductsPage';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';
import { AuthProvider, useAuth } from './auth-context.jsx';
import { AdminAuthProvider } from './admin-auth.jsx';
import { useCollections, useProducts } from './useFirebaseData';
import { CartProvider, useCart } from './cart-context.jsx';

const fallbackCollections = [
  {
    id: 'fabric-care',
    title: 'Fabric Care',
    description: 'Advanced washing systems for delicate textiles.'
  },
  {
    id: 'cold-storage',
    title: 'Cold Storage',
    description: 'Precision cooling for culinary preservation.'
  },
  {
    id: 'visual-arts',
    title: 'Visual Arts',
    description: 'Cinematic displays for immersive viewing.'
  },
  {
    id: 'climate-control',
    title: 'Climate Control',
    description: 'Atmospheric regulation for modern spaces.'
  }
];

const fallbackProducts = [
  {
    id: 'frostline-fridge',
    name: 'Frostline Smart Fridge',
    description: 'Counter-depth cooling with adaptive humidity drawers.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1584243027496-9645097a0054?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584243027496-9645097a0054?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579952361667-8e92354ee5b6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=600&fit=crop'
    ],
    category: 'Cold Storage',
    brand: 'Frostline',
    inStock: true,
    rating: 4.5,
    reviews: 127
  },
  {
    id: 'airstream-ac',
    name: 'Airstream Climate System',
    description: 'Whisper-quiet climate control for modern spaces.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584309983854-9f38d4f8f41d?w=800&h=600&fit=crop'
    ],
    category: 'Climate Control',
    brand: 'Airstream',
    inStock: true,
    rating: 4.3,
    reviews: 89
  },
  {
    id: 'silkguard-washer',
    name: 'Silkguard Washer',
    description: 'Precision fabric care with steam sanitization.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1626999256266-9e70b8e2f5b8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1588946413825-3b6a3a9c9f0c?w=800&h=600&fit=crop'
    ],
    category: 'Fabric Care',
    brand: 'Silkguard',
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: 'cinema-view-oled',
    name: 'CinemaView OLED',
    description: 'Ultra-thin 65" display with cinematic clarity.',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1596786350986-224a6375b5fa?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596786350986-224a6375b5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612876429769-5c8e8c99c6f2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598322275943-7926d0d5d9e9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606147544762-bf3d0960bc7a?w=800&h=600&fit=crop'
    ],
    category: 'Visual Arts',
    brand: 'CinemaView',
    inStock: true,
    rating: 4.8,
    reviews: 156
  }
];

const stats = [
  { value: '25+', label: 'Years of Excellence' },
  { value: '10k+', label: 'Curated Spaces' },
  { value: '500+', label: 'Premium Products' },
  { value: '100%', label: 'Client Satisfaction' }
];

const features = [
  {
    title: 'Certified Excellence',
    description:
      'Every appliance undergoes rigorous quality assurance testing to ensure longevity and performance.'
  },
  {
    title: 'White Glove Delivery',
    description: 'Complimentary installation and careful handling by our specialized logistics team.'
  },
  {
    title: 'Concierge Support',
    description: 'Dedicated technical specialists available to assist with setup and maintenance.'
  }
];

const AdminThemeWrapper = ({ children }) => (
  <div className="admin-theme-wrapper" style={{ minHeight: '100vh', position: 'relative' }}>
    <div className="bg-blobs">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
    {children}
  </div>
);

function AppWithAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const [checkoutStatus, setCheckoutStatus] = useState('idle');
  const { getCartItemCount, addToCart, subtotal, shipping, tax, total } = useCart();
  
  // Use Firebase real-time data
  const { collections: firebaseCollections, loading: collectionsLoading } = useCollections();
  const { products: firebaseProducts, loading: productsLoading } = useProducts();

  // Fallback data if Firebase is not available
  const fallbackCollections = [
    {
      id: 'fabric-care',
      title: 'Fabric Care',
      description: 'Advanced washing systems for delicate textiles.'
    },
    {
      id: 'cold-storage',
      title: 'Cold Storage',
      description: 'Precision cooling for culinary preservation.'
    },
    {
      id: 'cooking-tech',
      title: 'Cooking Technology',
      description: 'Smart ovens and induction cooking systems.'
    },
    {
      id: 'air-care',
      title: 'Air Care',
      description: 'Purifiers and climate control solutions.'
    },
    {
      id: 'small-appliances',
      title: 'Small Appliances',
      description: 'Compact solutions for modern kitchens.'
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      description: 'Audio and visual entertainment systems.'
    }
  ];

  const fallbackProducts = [
    {
      id: 'frostline-fridge',
      name: 'Frostline Smart Fridge',
      description: 'Counter-depth cooling with adaptive humidity drawers.',
      price: 899,
      originalPrice: 1299,
      conditionRating: 'Good',
      damageDescription: 'Small scratch on the left side panel. Fully functional.',
      warranty: '1 Year Limited Warranty',
      category: 'Cold Storage',
      brand: 'Frostline',
      inStock: true,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1584243027496-9645097a0054?w=800&h=600&fit=crop'
    },
    {
      id: 'silkguard-washer',
      name: 'Silkguard Washer',
      description: 'Ultra-quiet drum with steam cleaning for delicate fabrics.',
      price: 499,
      originalPrice: 749,
      conditionRating: 'Fair',
      damageDescription: 'Dent on the front door. Operates normally.',
      warranty: '6 Months Limited Warranty',
      category: 'Fabric Care',
      brand: 'Silkguard',
      inStock: true,
      rating: 4.7,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1558029006-66b89710c3cd?w=800&h=600&fit=crop'
    },
    {
      id: 'cinemaview-tv',
      name: 'CinemaView OLED TV',
      description: 'Ultra-thin 65" display with cinematic clarity.',
      price: 1199,
      originalPrice: 1599,
      conditionRating: 'Good',
      damageDescription: 'Minor scuffs on the back casing. Screen is flawless.',
      warranty: '1 Year Limited Warranty',
      category: 'Entertainment',
      brand: 'CinemaView',
      inStock: true,
      rating: 4.8,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1596786350986-224a6375b5fa?w=800&h=600&fit=crop'
    },
    {
      id: 'airpure-pro',
      name: 'AirPure Pro',
      description: 'HEPA filtration with smart air quality monitoring.',
      price: 499,
      originalPrice: 699,
      conditionRating: 'Like New',
      damageDescription: 'Open box return. No visible marks.',
      warranty: '2 Year Manufacturer',
      category: 'Air Care',
      brand: 'AirPure',
      inStock: true,
      rating: 4.3,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1574383404275-24236b5f264a?w=800&h=600&fit=crop'
    },
    {
      id: 'powerstation-elite',
      name: 'PowerStation Elite',
      description: 'Solar-compatible backup with app control.',
      price: 349,
      originalPrice: 499,
      conditionRating: 'Good',
      damageDescription: 'Slight discoloration on top panel.',
      warranty: '1 Year Limited Warranty',
      category: 'Small Appliances',
      brand: 'PowerStation',
      inStock: true,
      rating: 4.6,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&h=600&fit=crop'
    }
  ];

  // Use Firebase data if available, otherwise fallback
  const collections = firebaseCollections.length > 0 ? firebaseCollections : fallbackCollections;
  const products = firebaseProducts.length > 0 ? firebaseProducts : fallbackProducts;

  // Cart logic has been moved to CartContext

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        const [collectionsResponse, productsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/collections', {
            signal: controller.signal
          }),
          fetch('http://localhost:8080/api/products', {
            signal: controller.signal
          })
        ]);
        if (collectionsResponse.ok) {
          const data = await collectionsResponse.json();
          if (Array.isArray(data)) {
            setCollections(data);
          }
        }
        if (productsResponse.ok) {
          const data = await productsResponse.json();
          if (Array.isArray(data)) {
            setProducts(data);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Using fallback data.');
        }
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  // Totals are now fetched natively from CartContext

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckoutStatus('processing');
    try {
      const response = await fetch('http://localhost:8080/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: products.map(({ id }) => id) })
      });
      if (response.ok) {
        setCheckoutStatus('success');
      } else {
        setCheckoutStatus('error');
      }
    } catch (error) {
      setCheckoutStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/stores" element={<Store />} />
        <Route path="/support" element={<Support />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-orders" element={<UserOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<AdminThemeWrapper><AdminLogin /></AdminThemeWrapper>} />
        <Route path="/admin/dashboard" element={<AdminThemeWrapper><AdminDashboard /></AdminThemeWrapper>} />
        <Route path="/admin/products" element={<AdminThemeWrapper><ProductManagement /></AdminThemeWrapper>} />
        <Route path="/admin/orders" element={<AdminThemeWrapper><AdminOrders /></AdminThemeWrapper>} />
        <Route path="/admin/customers" element={<AdminThemeWrapper><AdminCustomers /></AdminThemeWrapper>} />
        <Route path="/admin/analytics" element={<AdminThemeWrapper><AdminAnalytics /></AdminThemeWrapper>} />
      </Routes>
    </Router>
  );

  function HomePage() {
    return (
      <div className="page">
        <div className="bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <header className="top-bar">
          <div className="brand">Patel Electronics</div>
          <nav className="top-actions">
            <Link to="/products" className="text-button">Products</Link>
            <Link to="/stores" className="text-button">Stores</Link>
            <Link to="/support" className="text-button">Support</Link>
            <Link to="/cart" className="text-button">Cart ({getCartItemCount()})</Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-orders" className="text-button">My Orders</Link>
                <Link to="/profile" className="text-button">Profile</Link>
              </>
            ) : (
              <Link to="/login" className="text-button">Sign In</Link>
            )}
            <Link to="/admin/login" className="text-button admin-link">Admin</Link>
          </nav>
        </header>

        <section className="hero">
          <p className="hero-tag">Trusted Electronics Shop · Est. 1998</p>
          <h1>
            Your Home,
            <span>Upgraded</span>
          </h1>
          <p className="hero-copy">
            Shop premium appliances, smart home tech, and white-glove service curated for modern
            living.
          </p>
          <div className="hero-actions">
            <Link to="/products"><button className="primary">Shop New Arrivals</button></Link>
            <button className="ghost">Schedule a Consultation</button>
          </div>
        </section>

        <section className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 15 }).map((_, index) => (
              <span key={`marquee-${index}`}>Electronics · Service · Smart Home · Delivery</span>
            ))}
          </div>
        </section>

        <section className="story">
          <div className="story-left">
            <h2>Everything for the modern electronics shop.</h2>
            <p>
              From flagship appliances to immersive entertainment, Patel Electronics is built to help
              you compare, customize, and complete your next upgrade in one place.
            </p>
          </div>
          <div className="story-right">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="collections">
          <div className="section-heading">
            <p className="eyebrow">Shop by Collection</p>
            <h2>Explore best-selling categories built for performance, reliability, and modern design.</h2>
          </div>
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <article key={collection.id} className="collection-card">
                <p className="collection-label">Collection {String(index + 1).padStart(2, '0')}</p>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <button className="text-button">View Products</button>
              </article>
            ))}
          </div>
        </section>

        <section className="products">
          <div className="section-heading">
            <p className="eyebrow">Electronics Shop</p>
            <h2>Handpicked appliances and smart home essentials.</h2>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="product-card-link">
                <article className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <p className="product-badge">In Stock</p>
                  </div>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="discount-reason">
                      <span className="reason-label">Discount Reason: </span>
                      {product.damageDescription || 'Open Box / Minor Cosmetic Flaw'}
                    </div>
                    <div className="product-rating">
                      <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span className="rating-text">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="product-footer">
                    <span className="price">${product.price.toLocaleString()}</span>
                    <button className="primary" onClick={(e) => { e.preventDefault(); addToCart(product); }}>Add to Cart</button>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="checkout">
          <div className="checkout-card">
            <div className="checkout-summary">
              <h2>Checkout Preview</h2>
              <p>
                Prototype payment gateway for demo purposes. Connect a payment provider when you are
                ready for production.
              </p>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Delivery</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <form className="payment-form" onSubmit={handleCheckout}>
              <h3>Payment Gateway (Prototype)</h3>
              <label>
                Cardholder Name
                <input type="text" placeholder="Asha Patel" required />
              </label>
              <label>
                Card Number
                <input type="text" placeholder="4242 4242 4242 4242" required />
              </label>
              <div className="payment-row">
                <label>
                  Expiry
                  <input type="text" placeholder="08/28" required />
                </label>
                <label>
                  CVC
                  <input type="text" placeholder="123" required />
                </label>
              </div>
              <label>
                Billing Email
                <input type="email" placeholder="hello@patelelectronics.com" required />
              </label>
              <button className="primary" type="submit">
                {checkoutStatus === 'processing' ? 'Processing...' : 'Complete Purchase'}
              </button>
              {checkoutStatus === 'success' && (
                <p className="status success">Payment authorized (prototype).</p>
              )}
              {checkoutStatus === 'error' && (
                <p className="status error">Payment failed. Please try again.</p>
              )}
            </form>
          </div>
        </section>

        <footer className="footer">
          <div>
            <h3>Patel Electronics</h3>
            <p>The electronics shop for appliances, smart home upgrades, and concierge service.</p>
          </div>
          <div className="footer-links">
            <h4>Departments</h4>
            <ul>
              {collections.map((collection) => (
                <li key={`footer-${collection.id}`}>{collection.title}</li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminAuthProvider>
          <AppWithAuth />
        </AdminAuthProvider>
      </CartProvider>
    </AuthProvider>
  );
}
