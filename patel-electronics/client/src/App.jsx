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
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import ProductsPage from './ProductsPage';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';
import Invoice from './Invoice';
import { AuthProvider, useAuth } from './auth-context.jsx';
import { AdminAuthProvider } from './admin-auth.jsx';
import { useCollections, useProducts } from './useFirebaseData';
import { CartProvider, useCart } from './cart-context.jsx';
import Navbar from './Navbar.jsx';

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
    price: 107817,
    image: '/images/fridge.png',
    images: [
      '/images/fridge.png',
      '/images/fridge.png',
      '/images/fridge.png',
      '/images/fridge.png'
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
    price: 74617,
    image: '/images/ac.png',
    images: [
      '/images/ac.png',
      '/images/ac.png',
      '/images/ac.png',
      '/images/ac.png'
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
    price: 62167,
    image: '/images/washer.png',
    images: [
      '/images/ac.png',
      '/images/ac.png',
      '/images/ac.png',
      '/images/ac.png'
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
    price: 132717,
    image: '/images/tv.png',
    images: [
      '/images/washer.png',
      '/images/washer.png',
      '/images/washer.png',
      '/images/washer.png'
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
      price: 74617,
      originalPrice: 107817,
      conditionRating: 'Good',
      damageDescription: 'Small scratch on the left side panel. Fully functional.',
      warranty: '1 Year Limited Warranty',
      category: 'Cold Storage',
      brand: 'Frostline',
      inStock: true,
      rating: 4.5,
      reviews: 128,
      image: '/images/fridge.png'
    },
    {
      id: 'silkguard-washer',
      name: 'Silkguard Washer',
      description: 'Ultra-quiet drum with steam cleaning for delicate fabrics.',
      price: 41417,
      originalPrice: 62167,
      conditionRating: 'Fair',
      damageDescription: 'Dent on the front door. Operates normally.',
      warranty: '6 Months Limited Warranty',
      category: 'Fabric Care',
      brand: 'Silkguard',
      inStock: true,
      rating: 4.7,
      reviews: 89,
      image: '/images/washer.png'
    },
    {
      id: 'cinemaview-tv',
      name: 'CinemaView OLED TV',
      description: 'Ultra-thin 65" display with cinematic clarity.',
      price: 99517,
      originalPrice: 132717,
      conditionRating: 'Good',
      damageDescription: 'Minor scuffs on the back casing. Screen is flawless.',
      warranty: '1 Year Limited Warranty',
      category: 'Entertainment',
      brand: 'CinemaView',
      inStock: true,
      rating: 4.8,
      reviews: 203,
      image: '/images/tv.png'
    },
    {
      id: 'airpure-pro',
      name: 'AirPure Pro',
      description: 'HEPA filtration with smart air quality monitoring.',
      price: 41417,
      originalPrice: 58017,
      conditionRating: 'Like New',
      damageDescription: 'Open box return. No visible marks.',
      warranty: '2 Year Manufacturer',
      category: 'Air Care',
      brand: 'AirPure',
      inStock: true,
      rating: 4.3,
      reviews: 67,
      image: '/images/purifier.png'
    },
    {
      id: 'powerstation-elite',
      name: 'PowerStation Elite',
      description: 'Solar-compatible backup with app control.',
      price: 28967,
      originalPrice: 41417,
      conditionRating: 'Good',
      damageDescription: 'Slight discoloration on top panel.',
      warranty: '1 Year Limited Warranty',
      category: 'Small Appliances',
      brand: 'PowerStation',
      inStock: true,
      rating: 4.6,
      reviews: 45,
      image: '/images/powerstation.png'
    }
  ];

  // Use Firebase data if available, otherwise fallback
  const collections = firebaseCollections.length > 0 ? firebaseCollections : fallbackCollections;
  const products = firebaseProducts.length > 0 ? firebaseProducts : fallbackProducts;

  // Cart logic has been moved to CartContext



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
        <Route path="/admin/dashboard" element={<AdminThemeWrapper><AdminDashboard /></AdminThemeWrapper>} />
        <Route path="/admin/products" element={<AdminThemeWrapper><ProductManagement /></AdminThemeWrapper>} />
        <Route path="/admin/orders" element={<AdminThemeWrapper><AdminOrders /></AdminThemeWrapper>} />
        <Route path="/admin/customers" element={<AdminThemeWrapper><AdminCustomers /></AdminThemeWrapper>} />
        <Route path="/admin/analytics" element={<AdminThemeWrapper><AdminAnalytics /></AdminThemeWrapper>} />
        <Route path="/invoice/:orderId" element={<Invoice />} />
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

        <Navbar />

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
                    <span className="price">₹{product.price.toLocaleString()}</span>
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

        <section className="concierge-newsletter" style={{ padding: '80px 8vw', borderTop: '1px solid var(--border)' }}>
          <div className="newsletter-wrapper" style={{ 
            background: 'linear-gradient(145deg, rgba(20,20,25,0.8) 0%, rgba(10,10,12,0.9) 100%)', 
            border: '1px solid var(--border)',
            borderRadius: '24px', 
            padding: '60px 40px', 
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p className="eyebrow" style={{ color: 'var(--accent)', marginBottom: '16px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Join Patel Concierge
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '24px', fontFamily: '"Outfit", sans-serif', color: 'var(--text-main)' }}>
                Elevate your smart home.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                Subscribe to our inner circle for priority access to limited-edition appliances, private sale events, and complimentary smart home consultations.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Welcome to the inner circle!'); }} style={{ display: 'flex', gap: '16px', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input 
                  type="email" 
                  placeholder="Enter your preferred email" 
                  required 
                  style={{ 
                    flex: '1 1 250px', 
                    padding: '16px 24px', 
                    borderRadius: '8px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'var(--text-main)', 
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border 0.3s ease'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="submit" className="primary" style={{ whiteSpace: 'nowrap', padding: '16px 36px' }}>
                  Subscribe Access
                </button>
              </form>
            </div>
            
            {/* Background decorative glows */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: '0.15', filter: 'blur(50px)', zIndex: 1, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)', opacity: '0.15', filter: 'blur(50px)', zIndex: 1, pointerEvents: 'none' }}></div>
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
