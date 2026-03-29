import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';
import { getApplianceImage } from './imageUtils';
import { useCart } from './cart-context.jsx';
import Navbar from './Navbar.jsx';

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
    reviews: 127,
    specifications: {
      'Capacity': '21.8 cu. ft.',
      'Dimensions': '35.75" D x 29.88" W x 70.13" H',
      'Finish': 'Stainless Steel',
      'Energy Star': 'Yes',
      'Smart Features': 'WiFi Connected, App Control',
      'Warranty': '1 Year Limited'
    }
  },
  {
    id: 'airstream-ac',
    name: 'Airstream Climate System',
    description: 'Whisper-quiet climate control for modern spaces.',
    price: 58017,
    originalPrice: 74617,
    conditionRating: 'Like New',
    damageDescription: 'Open box return, no visible defects.',
    warranty: '2 Year Manufacturer Warranty',
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
    reviews: 89,
    specifications: {
      'Cooling Capacity': '12,000 BTU',
      'Coverage Area': '550 sq. ft.',
      'Noise Level': '42 dB',
      'Energy Efficiency': 'SEER 16',
      'Smart Features': 'WiFi, Voice Control',
      'Warranty': '2 Years Limited'
    }
  },
  {
    id: 'silkguard-washer',
    name: 'Silkguard Washer',
    description: 'Precision fabric care with steam sanitization.',
    price: 41417,
    originalPrice: 62167,
    conditionRating: 'Fair',
    damageDescription: 'Dent on the front door. Operates normally.',
    warranty: '6 Months Limited Warranty',
    image: '/images/washer.png',
    images: [
      '/images/washer.png',
      '/images/washer.png',
      '/images/washer.png',
      '/images/washer.png'
    ],
    category: 'Fabric Care',
    brand: 'Silkguard',
    inStock: true,
    rating: 4.7,
    reviews: 203,
    specifications: {
      'Capacity': '4.5 cu. ft.',
      'Cycles': '12 Preset Programs',
      'Spin Speed': '1400 RPM',
      'Steam Function': 'Yes',
      'Smart Features': 'WiFi Connected',
      'Warranty': '6 Months Limited'
    }
  },
  {
    id: 'cinema-view-oled',
    name: 'CinemaView OLED',
    description: 'Ultra-thin 65" display with cinematic clarity.',
    price: 99517,
    originalPrice: 132717,
    conditionRating: 'Good',
    damageDescription: 'Minor scuffs on the back casing. Screen is flawless.',
    warranty: '1 Year Limited Warranty',
    image: '/images/tv.png',
    images: [
      '/images/ac.png',
      '/images/ac.png',
      '/images/ac.png',
      '/images/ac.png'
    ],
    category: 'Visual Arts',
    brand: 'CinemaView',
    inStock: true,
    rating: 4.8,
    reviews: 156,
    specifications: {
      'Screen Size': '65 inches',
      'Resolution': '4K UHD (3840 x 2160)',
      'Display Type': 'OLED',
      'HDR': 'Dolby Vision, HDR10+',
      'Smart TV': 'Yes - Android TV',
      'Warranty': '1 Year Limited'
    }
  }
];

export default function ProductDetail() {
  const { productId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState('idle');
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const foundProduct = fallbackProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [productId]);

  const handleImageError = (imageIndex) => {
    setImageErrors(prev => ({ ...prev, [imageIndex]: true }));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to cart');
      return;
    }

    setCartStatus('adding');
    addToCart(product, quantity);
    
    // Simulate API delay for UX
    setTimeout(() => {
      setCartStatus('added');
      setTimeout(() => setCartStatus('idle'), 2000);
    }, 500);
  };

  const handleBuyNow = () => {
    // Simulate buy now action
    alert(`Proceeding to checkout with ${quantity} x ${product.name}`);
  };

  const getImageUrl = (index) => {
    if (imageErrors[index]) {
      // Fallback to a placeholder if image fails to load
      return getApplianceImage(product?.category, `${product?.id}-${index}`);
    }
    return product?.images[index] || product?.image;
  };

  if (!product) {
    return (
      <div className="page">
        <div className="bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        <Navbar />
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  return (
    <div className="page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <Navbar />

      <div className="product-detail-container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to={`/${product.category}`}>{product.category}</Link> / {product.name}
        </nav>

        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={getImageUrl(selectedImage)} 
                alt={product.name} 
                onError={() => handleImageError(selectedImage)}
                loading="lazy"
              />
            </div>
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={getImageUrl(index)} 
                    alt={`${product.name} view ${index + 1}`}
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-meta">
                <div className="rating">
                  {renderStars(product.rating)}
                  <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
                </div>
                <span className="brand">Brand: {product.brand}</span>
              </div>
            </div>

            <div className="price-section">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                <div className="price">₹{product.price.toLocaleString()}</div>
                {product.originalPrice && (
                  <>
                    <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem' }}>
                      ₹{product.originalPrice.toLocaleString()}
                    </div>
                    <div style={{ background: '#e6f4ea', color: '#137333', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  </>
                )}
              </div>
              <div className="stock-status">
                {product.inStock ? (
                  <span className="in-stock">✓ In Stock</span>
                ) : (
                  <span className="out-stock">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="discount-reason" style={{ margin: '2rem 0', padding: '1.25rem', fontSize: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#ff9900', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <span role="img" aria-label="alert">⚠️</span> Condition: {product.conditionRating || 'New'}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                <span className="reason-label">Discount Reason: </span>
                {product.damageDescription || 'Open Box / Minor Cosmetic Flaw'}
              </p>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="action-buttons">
                <button 
                  className={`primary add-to-cart ${cartStatus}`}
                  onClick={handleAddToCart}
                  disabled={cartStatus === 'adding'}
                >
                  {cartStatus === 'adding' ? 'Adding...' : 
                   cartStatus === 'added' ? '✓ Added' : 'Add to Cart'}
                </button>
                <button className="ghost buy-now" onClick={handleBuyNow}>Buy Now</button>
              </div>
            </div>

            <div className="product-features">
              <h3>Key Features</h3>
              <ul>
                <li>Premium quality construction</li>
                <li>Energy efficient design</li>
                <li>Smart home compatible</li>
                <li>Professional installation available</li>
                <li>2-year manufacturer warranty</li>
              </ul>
            </div>
          </div>

          <div className="product-specifications">
            <h3>Specifications</h3>
            <div className="specs-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .add-to-cart.adding {
          background-color: #ffa500;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .add-to-cart.added {
          background-color: #008000;
        }

        .buy-now:hover {
          background-color: #fff5e6;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          background-color: #f5f5f5;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #f5f5f5;
        }

        .thumbnail img:hover {
          transform: scale(1.05);
          transition: transform 0.2s;
        }

        .product-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .breadcrumb {
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .breadcrumb a {
          color: #0066cc;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 300px;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .product-images {
          grid-row: span 2;
        }

        .main-image {
          width: 100%;
          height: 400px;
          margin-bottom: 1rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-thumbnails {
          display: flex;
          gap: 0.5rem;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .thumbnail.active {
          border-color: #0066cc;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-header h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .star {
          color: #ffa500;
        }

        .star.empty {
          color: #ddd;
        }

        .rating-text {
          color: #666;
          font-size: 0.9rem;
        }

        .brand {
          color: #666;
          font-size: 0.9rem;
        }

        .price-section {
          margin-bottom: 2rem;
        }

        .price {
          font-size: 2rem;
          font-weight: bold;
          color: #b12704;
          margin-bottom: 0.5rem;
        }

        .in-stock {
          color: #008000;
        }

        .out-stock {
          color: #b12704;
        }

        .product-description {
          margin-bottom: 2rem;
        }

        .product-description h3 {
          margin-bottom: 0.5rem;
        }

        .purchase-section {
          margin-bottom: 2rem;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .quantity-selector select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .action-buttons button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .add-to-cart {
          background-color: #ffa500;
          color: white;
        }

        .buy-now {
          background-color: white;
          border: 1px solid #ffa500;
          color: #ffa500;
        }

        .product-features {
          margin-bottom: 2rem;
        }

        .product-features h3 {
          margin-bottom: 1rem;
        }

        .product-features ul {
          list-style: none;
          padding: 0;
        }

        .product-features li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .product-features li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #008000;
        }

        .product-specifications {
          grid-column: 3;
        }

        .product-specifications h3 {
          margin-bottom: 1rem;
        }

        .specs-grid {
          display: grid;
          gap: 0.5rem;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }

        .spec-label {
          font-weight: bold;
        }

        .spec-value {
          color: #666;
        }

        @media (max-width: 1024px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .product-specifications {
            grid-column: span 2;
            grid-row: 3;
          }
        }

        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr;
          }

          .product-images {
            grid-row: auto;
          }

          .product-specifications {
            grid-column: auto;
            grid-row: auto;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
