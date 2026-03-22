import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts, useCollections } from './useFirebaseData';
import { getApplianceImage } from './imageUtils';
import { useCart } from './cart-context.jsx';

export default function ProductsPage() {
  const { products, loading: productsLoading } = useProducts();
  const { collections } = useCollections();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (priceRange !== 'all') params.set('price', priceRange);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, priceRange, setSearchParams]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === '0-500') matchesPrice = product.price <= 500;
    else if (priceRange === '500-1000') matchesPrice = product.price > 500 && product.price <= 1000;
    else if (priceRange === '1000-1500') matchesPrice = product.price > 1000 && product.price <= 1500;
    else if (priceRange === '1500+') matchesPrice = product.price > 1500;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // featured
  });

  const renderStars = (rating) => {
    return (
      <div className="product-rating">
        <div className="stars">
          {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
        </div>
        <span className="rating-text">({rating})</span>
      </div>
    );
  };

  if (productsLoading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
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

      <div className="products-page">
        {/* Header */}
        <div className="products-header">
          <div className="products-title">
            <h1>All Products</h1>
            <p>Discover our complete range of electronics and appliances</p>
          </div>
          <div className="results-count">
            {sortedProducts.length} products found
          </div>
        </div>

        {/* Filters Sidebar */}
        <aside className="products-sidebar">
          <div className="filter-section">
            <h3>Search</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === 'all'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span>All Categories</span>
              </label>
              {collections.map(collection => (
                <label key={collection.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={collection.title}
                    checked={selectedCategory === collection.title}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>{collection.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-filters">
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="all"
                  checked={priceRange === 'all'}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <span>All Prices</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="0-500"
                  checked={priceRange === '0-500'}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <span>Under $500</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="500-1000"
                  checked={priceRange === '500-1000'}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <span>$500 - $1,000</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="1000-1500"
                  checked={priceRange === '1000-1500'}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <span>$1,000 - $1,500</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="1500+"
                  checked={priceRange === '1500+'}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <span>Over $1,500</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="filter-section">
            <h3>View</h3>
            <div className="view-options">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </aside>

        {/* Products Grid/List */}
        <main className="products-main">
          {sortedProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="product-grid">
              {sortedProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = getApplianceImage(product.category, product.id);
                        }}
                      />
                    </Link>
                    {product.conditionRating && (
                      <div className="condition-badge">{product.conditionRating}</div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <Link to={`/product/${product.id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <div className="product-rating">
                      {renderStars(product.rating)}
                      <span className="review-count">({product.reviews} reviews)</span>
                    </div>
                    <p className="product-desc">{product.description}</p>
                    <div className="discount-reason">
                      <span className="reason-label">Discount Reason: </span>
                      {product.damageDescription || 'Open Box / Minor Cosmetic Flaw'}
                    </div>
                    <div className="product-meta">
                      <span className="product-category">{product.category}</span>
                    </div>
                  </div>
                  
                  <div className="product-price-row">
                    <div>
                      <div className="product-price">${product.price.toLocaleString()}</div>
                      {product.originalPrice && (
                        <div style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          ${product.originalPrice.toLocaleString()}
                        </div>
                      )}
                      <div style={{ color: '#00ff80', fontSize: '0.85rem', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Free Delivery
                      </div>
                    </div>
                    <button className="add-to-cart-btn" onClick={(e) => { e.preventDefault(); addToCart(product); }}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .products-page {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .products-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          padding: 1.5rem 2rem;
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .products-title h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .products-title p {
          color: var(--text-muted);
        }

        .results-count {
          color: var(--accent);
          font-weight: 500;
          font-size: 1.1rem;
        }

        .products-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .products-sidebar {
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border);
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .filter-section {
          margin-bottom: 2rem;
        }

        .filter-section:last-child {
          margin-bottom: 0;
        }

        .filter-section h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.95rem;
          background: rgba(0,0,0,0.5);
          color: var(--text-main);
        }

        .category-filters,
        .price-filters {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          color: var(--text-muted);
        }

        .filter-option:hover {
          color: var(--text-main);
        }

        .sort-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.95rem;
          background: rgba(0,0,0,0.5);
          color: var(--text-main);
        }

        /* AMAZON-STYLE VERTICAL LIST */
        .product-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .product-card {
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border);
          display: grid;
          grid-template-columns: 240px 1fr 240px;
          gap: 2rem;
          align-items: stretch;
          transition: border-color 0.2s;
        }

        .product-card:hover {
          border-color: rgba(255,255,255,0.2);
        }

        .product-image-container {
          position: relative;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          overflow: hidden;
          width: 240px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .condition-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          color: var(--accent);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          border: 1px solid rgba(0, 240, 255, 0.3);
        }

        .product-info {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
        }

        .product-info h3 {
          font-size: 1.4rem;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .product-brand {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          color: #ff9900;
          font-size: 1.1rem;
        }

        .review-count {
          color: var(--accent);
          font-size: 0.9rem;
        }

        .product-desc {
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: auto;
        }

        .product-meta {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .product-category {
          color: #888;
          font-size: 0.85rem;
        }

        .product-price-row {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(0,0,0,0.2);
          padding: 1.5rem;
          border-radius: 12px;
          height: 100%;
        }

        .product-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 100px;
          border: none;
          background: #ffd814;
          color: #0f1111;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }

        .add-to-cart-btn:hover {
          background: #f7ca00;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
        }

        .no-products h3 {
          margin-bottom: 1rem;
          color: var(--dark);
        }

        /* List view styles */
        .products-container.list .product-card {
          display: flex;
          height: 150px;
        }

        .products-container.list .product-image {
          width: 200px;
          height: 150px;
          flex-shrink: 0;
        }

        .products-container.list .product-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .products-container.list .product-description {
          -webkit-line-clamp: 1;
        }

        @media (max-width: 1024px) {
          .products-page {
            flex-direction: column;
          }

          .products-sidebar {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .products-page {
            padding: 1rem;
          }

          .products-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .products-sidebar {
            grid-template-columns: 1fr;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .products-container.list .product-card {
            flex-direction: column;
            height: auto;
          }

          .products-container.list .product-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
