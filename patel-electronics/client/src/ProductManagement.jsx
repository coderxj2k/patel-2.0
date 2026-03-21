import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './admin-auth';
import { useProductCRUD } from './useFirebaseData';
import { getApplianceImage } from './imageUtils';

export default function ProductManagement() {
  const { admin, hasPermission } = useAdminAuth();
  const navigate = useNavigate();
  const { addProduct, updateProduct, deleteProduct } = useProductCRUD();
  
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    conditionRating: 'Good',
    damageDescription: '',
    warranty: '',
    category: 'Cold Storage',
    brand: 'Frostline',
    inStock: true,
    rating: 0,
    reviews: 0,
    image: ''
  });

  const categories = [
    'Cold Storage',
    'Fabric Care', 
    'Cooking Technology',
    'Air Care',
    'Small Appliances',
    'Entertainment'
  ];

  const brands = [
    'Frostline',
    'Silkguard',
    'CinemaView',
    'AirPure',
    'PowerStation',
    'SmartCook',
    'CleanAir',
    'TechPro'
  ];

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }

    if (!hasPermission('manage_products')) {
      navigate('/admin/dashboard');
      return;
    }

    loadProducts();
  }, [admin, navigate, hasPermission]);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('patelElectronicsProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
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
      setProducts(defaultProducts);
      localStorage.setItem('patelElectronicsProducts', JSON.stringify(defaultProducts));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      conditionRating: 'Good',
      damageDescription: '',
      warranty: '',
      category: 'Cold Storage',
      brand: 'Frostline',
      inStock: true,
      rating: 0,
      reviews: 0,
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setLoading(true);
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          const updatedProducts = products.filter(p => p.id !== productId);
          setProducts(updatedProducts);
          localStorage.setItem('patelElectronicsProducts', JSON.stringify(updatedProducts));
        } else {
          alert('Error deleting product: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        id: formData.id || `product-${Date.now()}`,
        image: formData.image || getApplianceImage(formData.category, formData.name)
      };

      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData);
        if (result.success) {
          const updatedProducts = products.map(p => 
            p.id === editingProduct.id ? productData : p
          );
          setProducts(updatedProducts);
          localStorage.setItem('patelElectronicsProducts', JSON.stringify(updatedProducts));
        }
      } else {
        result = await addProduct(productData);
        if (result.success) {
          const updatedProducts = [...products, productData];
          setProducts(updatedProducts);
          localStorage.setItem('patelElectronicsProducts', JSON.stringify(updatedProducts));
        }
      }

      if (result.success) {
        setIsModalOpen(false);
        setEditingProduct(null);
      } else {
        alert('Error saving product: ' + result.error);
      }
    } catch (error) {
      alert('Error saving product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
        <span className="rating-text">({rating})</span>
      </div>
    );
  };

  return (
    <div className="product-management">
      {/* Navigation Bar */}
      <nav className="pm-nav">
        <div className="pm-nav-content">
          <div className="pm-nav-brand">
            <Link to="/admin/dashboard" className="pm-nav-link">
              <span className="pm-nav-icon">🏠</span>
              Dashboard
            </Link>
          </div>
          
          <div className="pm-nav-menu">
            <Link to="/admin/products" className="pm-nav-link pm-nav-active">
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
              onClick={() => navigate('/admin/login')}
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
            <h1>Product Management</h1>
            <p>Manage your product inventory and pricing</p>
          </div>
          <div className="pm-actions">
            <button className="pm-btn pm-btn-primary" onClick={handleAddProduct}>
              <span className="pm-btn-icon">+</span>
              Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="pm-stats">
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>📦</span>
          </div>
          <div className="pm-stat-content">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>✅</span>
          </div>
          <div className="pm-stat-content">
            <h3>{products.filter(p => p.inStock).length}</h3>
            <p>In Stock</p>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>📊</span>
          </div>
          <div className="pm-stat-content">
            <h3>${products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0}</h3>
            <p>Avg Price</p>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-icon">
            <span>🏷️</span>
          </div>
          <div className="pm-stat-content">
            <h3>{new Set(products.map(p => p.category)).size}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="pm-controls">
        <div className="pm-search-filters">
          <div className="pm-search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pm-search-input"
            />
            <span className="pm-search-icon">🔍</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pm-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="pm-view-controls">
          <button
            className={`pm-view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <span>📋</span>
            Table
          </button>
          <button
            className={`pm-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <span>🏪</span>
            Grid
          </button>
        </div>
      </div>

      {/* Products Display */}
      <div className="pm-products-container">
        {viewMode === 'table' ? (
          <div className="pm-table-container">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category / Condition</th>
                  <th>Brand</th>
                  <th>Price / Original</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="pm-table-row">
                    <td>
                      <div className="pm-product-info">
                        <img src={product.image} alt={product.name} className="pm-product-thumb" />
                        <div className="pm-product-details">
                          <h4>{product.name}</h4>
                          <p>{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="pm-category-badge">{product.category}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Condition: {product.conditionRating || 'New'}</span>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="pm-price">${product.price}</span>
                        {product.originalPrice && (
                          <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#9ca3af' }}>
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`pm-stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                        {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                      </span>
                    </td>
                    <td>
                      {renderStars(product.rating)}
                    </td>
                    <td>
                      <div className="pm-table-actions">
                        <button 
                          className="pm-action-btn pm-edit-btn"
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="pm-action-btn pm-delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={loading}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="pm-grid-container">
            {filteredProducts.map((product) => (
              <div key={product.id} className="pm-product-card">
                <div className="pm-card-image">
                  <img src={product.image} alt={product.name} />
                  <span className={`pm-card-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="pm-card-content">
                  <h3>{product.name}</h3>
                  <p className="pm-card-description">{product.description}</p>
                  <div className="pm-card-meta">
                    <span className="pm-card-category">{product.category}</span>
                    <span className="pm-card-brand">{product.brand}</span>
                  </div>
                  <div className="pm-card-rating">
                    {renderStars(product.rating)}
                  </div>
                  <div className="pm-card-footer">
                    <span className="pm-card-price">${product.price}</span>
                    <div className="pm-card-actions">
                      <button 
                        className="pm-card-btn pm-edit-btn"
                        onClick={() => handleEditProduct(product)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="pm-card-btn pm-delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="pm-modal-overlay">
          <div className="pm-modal">
            <div className="pm-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="pm-modal-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form className="pm-form" onSubmit={handleSubmit}>
              <div className="pm-form-grid">
                <div className="pm-form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="pm-form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="pm-form-group">
                  <label>Original Price ($) *</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="pm-form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pm-form-group">
                  <label>Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="pm-form-group">
                  <label>Condition Rating *</label>
                  <select
                    name="conditionRating"
                    value={formData.conditionRating}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Scratch & Dent">Scratch & Dent</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                <div className="pm-form-group">
                  <label>Warranty</label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g. 1 Year Limited Warranty"
                  />
                </div>

                <div className="pm-form-group pm-full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the product features and benefits"
                    rows="3"
                    required
                  />
                </div>

                <div className="pm-form-group pm-full-width">
                  <label>Damage Description</label>
                  <textarea
                    name="damageDescription"
                    value={formData.damageDescription}
                    onChange={handleInputChange}
                    placeholder="Describe any visible scratches, dents, or missing accessories"
                    rows="2"
                  />
                </div>

                <div className="pm-form-group pm-full-width">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/product-image.jpg"
                  />
                  <small>Leave empty for auto-generated image</small>
                </div>

                <div className="pm-form-group">
                  <label>Stock Status</label>
                  <label className="pm-switch">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                    />
                    <span className="pm-slider"></span>
                    <span className="pm-switch-label">{formData.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </label>
                </div>

                <div className="pm-form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div className="pm-form-group">
                  <label>Reviews</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="pm-form-actions">
                <button type="button" className="pm-btn pm-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="pm-btn pm-btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .product-management {
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

        .pm-btn-secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .pm-btn-secondary:hover {
          background: #e2e8f0;
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

        /* Controls */
        .pm-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
          gap: 1rem;
        }

        .pm-search-filters {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .pm-search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .pm-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .pm-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .pm-filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
        }

        .pm-view-controls {
          display: flex;
          gap: 0.5rem;
        }

        .pm-view-btn {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .pm-view-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        /* Table */
        .pm-table-container {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          margin: 0 2rem 2rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .pm-table {
          width: 100%;
          border-collapse: collapse;
        }

        .pm-table th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .pm-table td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .pm-product-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pm-product-thumb {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .pm-product-details h4 {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .pm-product-details p {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .pm-category-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .pm-price {
          font-weight: 700;
          color: #1e293b;
          font-size: 1.125rem;
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

        .pm-stock-badge.out-stock {
          background: #fee2e2;
          color: #dc2626;
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .star {
          color: #d1d5db;
          font-size: 0.875rem;
        }

        .star.filled {
          color: #fbbf24;
        }

        .rating-text {
          color: #64748b;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .pm-table-actions {
          display: flex;
          gap: 0.5rem;
        }

        .pm-action-btn {
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
        }

        .pm-edit-btn {
          background: #3b82f6;
          color: white;
        }

        .pm-edit-btn:hover {
          background: #2563eb;
        }

        .pm-delete-btn {
          background: #ef4444;
          color: white;
        }

        .pm-delete-btn:hover {
          background: #dc2626;
        }

        /* Grid */
        .pm-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 0 2rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .pm-product-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .pm-product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .pm-card-image {
          position: relative;
          height: 200px;
        }

        .pm-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pm-card-stock {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .pm-card-stock.in-stock {
          background: #dcfce7;
          color: #166534;
        }

        .pm-card-stock.out-stock {
          background: #fee2e2;
          color: #dc2626;
        }

        .pm-card-content {
          padding: 1.5rem;
        }

        .pm-card-content h3 {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .pm-card-description {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pm-card-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .pm-card-category,
        .pm-card-brand {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        .pm-card-rating {
          margin-bottom: 1rem;
        }

        .pm-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pm-card-price {
          font-weight: 700;
          color: #1e293b;
          font-size: 1.25rem;
        }

        .pm-card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .pm-card-btn {
          width: 2rem;
          height: 2rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Modal */
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
        }

        .pm-modal {
          background: white;
          border-radius: 1rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
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
          color: #1e293b;
        }

        .pm-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pm-modal-close:hover {
          background: #f3f4f6;
        }

        .pm-form {
          padding: 1.5rem;
        }

        .pm-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .pm-form-group.pm-full-width {
          grid-column: span 2;
        }

        .pm-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .pm-form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .pm-form-group input,
        .pm-form-group select,
        .pm-form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .pm-form-group input:focus,
        .pm-form-group select:focus,
        .pm-form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .pm-form-group textarea {
          resize: vertical;
        }

        .pm-form-group small {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .pm-switch {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .pm-switch input {
          display: none;
        }

        .pm-slider {
          width: 2.5rem;
          height: 1.25rem;
          background: #d1d5db;
          border-radius: 0.625rem;
          position: relative;
          transition: background 0.2s;
        }

        .pm-slider:before {
          content: '';
          position: absolute;
          width: 1rem;
          height: 1rem;
          background: white;
          border-radius: 50%;
          top: 0.125rem;
          left: 0.125rem;
          transition: transform 0.2s;
        }

        .pm-switch input:checked + .pm-slider {
          background: #3b82f6;
        }

        .pm-switch input:checked + .pm-slider:before {
          transform: translateX(1.25rem);
        }

        .pm-switch-label {
          font-weight: 500;
          color: #374151;
        }

        .pm-form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .pm-header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .pm-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .pm-search-filters {
            flex-direction: column;
          }

          .pm-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .pm-grid-container {
            grid-template-columns: 1fr;
          }

          .pm-form-grid {
            grid-template-columns: 1fr;
          }

          .pm-form-group.pm-full-width {
            grid-column: span 1;
          }

          .pm-form-actions {
            flex-direction: column;
          }

          .pm-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
