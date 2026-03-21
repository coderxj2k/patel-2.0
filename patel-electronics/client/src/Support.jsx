import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';

const supportCategories = [
  {
    id: 'product-support',
    title: 'Product Support',
    icon: '📱',
    description: 'Get help with product setup, troubleshooting, and maintenance',
    topics: [
      'Installation Guides',
      'User Manuals',
      'Troubleshooting',
      'Warranty Information',
      'Software Updates'
    ]
  },
  {
    id: 'service-requests',
    title: 'Service Requests',
    icon: '🔧',
    description: 'Schedule service, track repairs, and find service centers',
    topics: [
      'Schedule Service',
      'Track Repair Status',
      'Find Service Centers',
      'Spare Parts',
      'Service Pricing'
    ]
  },
  {
    id: 'orders-delivery',
    title: 'Orders & Delivery',
    icon: '📦',
    description: 'Track orders, manage returns, and delivery information',
    topics: [
      'Track Order',
      'Delivery Schedule',
      'Return Policy',
      'Order Changes',
      'Delivery Issues'
    ]
  },
  {
    id: 'account-billing',
    title: 'Account & Billing',
    icon: '💳',
    description: 'Manage your account, payments, and billing inquiries',
    topics: [
      'Account Settings',
      'Payment Methods',
      'Billing History',
      'Invoices',
      'Refund Status'
    ]
  }
];

const faqs = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most products. Items must be in original condition with all accessories and packaging. Some restrictions apply for customized items and large appliances.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for most items. Large appliances may require 7-14 days for delivery and installation.'
  },
  {
    question: 'Do you offer installation services?',
    answer: 'Yes, we provide professional installation for all major appliances. Installation can be scheduled at checkout or by contacting our service team.'
  },
  {
    question: 'What does the warranty cover?',
    answer: 'Our products come with manufacturer warranties ranging from 1-5 years. Coverage includes manufacturing defects and mechanical failures. Extended warranty options are available.'
  },
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by logging into your account or using the order tracking link in your confirmation email. Real-time updates are provided throughout the delivery process.'
  }
];

export default function Support() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const handleFaqToggle = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Support request submitted! We will respond within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand">
          <Link to="/">Patel Electronics</Link>
        </div>
        <nav className="top-actions">
          <Link to="/stores" className="text-button">Stores</Link>
          <Link to="/support" className="text-button active">Support</Link>
          <Link to="/cart" className="text-button">Cart</Link>
          {isAuthenticated ? (
            <Link to="/profile" className="text-button">Profile</Link>
          ) : (
            <Link to="/login" className="text-button">Sign In</Link>
          )}
        </nav>
      </header>

      <div className="support-container">
        <section className="support-hero">
          <div className="support-hero-content">
            <h1>How Can We Help?</h1>
            <p>Get expert support for all your electronics needs. Our team is here to assist you 24/7.</p>
            <div className="contact-options">
              <div className="contact-option">
                <span className="icon">📞</span>
                <div>
                  <h3>Phone Support</h3>
                  <p>1800-123-4567</p>
                  <span>24/7 Available</span>
                </div>
              </div>
              <div className="contact-option">
                <span className="icon">💬</span>
                <div>
                  <h3>Live Chat</h3>
                  <p>Chat with experts</p>
                  <span>Instant response</span>
                </div>
              </div>
              <div className="contact-option">
                <span className="icon">✉️</span>
                <div>
                  <h3>Email Support</h3>
                  <p>support@patelelectronics.com</p>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="support-categories">
          <div className="section-heading">
            <p className="eyebrow">Support Categories</p>
            <h2>Choose your support need</h2>
          </div>
          
          <div className="categories-grid">
            {supportCategories.map((category) => (
              <article 
                key={category.id} 
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h3>{category.title}</h3>
                </div>
                <p>{category.description}</p>
                {selectedCategory === category.id && (
                  <div className="category-topics">
                    {category.topics.map((topic, index) => (
                      <div key={index} className="topic-item">
                        <span>→</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">
            <p className="eyebrow">Frequently Asked Questions</p>
            <h2>Quick answers to common questions</h2>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${expandedFaq === index ? 'expanded' : ''}`}
                  onClick={() => handleFaqToggle(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle">{expandedFaq === index ? '−' : '+'}</span>
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="contact-form-section">
          <div className="section-heading">
            <p className="eyebrow">Contact Us</p>
            <h2>Send us a message</h2>
          </div>
          
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Issue</option>
                  <option value="delivery">Delivery Problem</option>
                  <option value="return">Return Request</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5" 
                  required 
                ></textarea>
              </div>
              
              <button type="submit" className="primary">Send Message</button>
            </form>
          </div>
        </section>
      </div>

      <style jsx>{`
        .support-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .support-hero {
          background: linear-gradient(135deg, #15130f 0%, #b7976a 100%);
          color: var(--cream);
          border-radius: 32px;
          padding: 4rem 3rem;
          margin-bottom: 4rem;
          text-align: center;
        }

        .support-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .support-hero p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .contact-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .contact-option {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .contact-option .icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .contact-option h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .contact-option p {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .contact-option span {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .section-heading {
          margin-bottom: 3rem;
          text-align: center;
        }

        .section-heading .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.75rem;
          color: var(--accent);
          margin-bottom: 12px;
        }

        .section-heading h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: var(--dark);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .category-card {
          background: var(--white);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(21, 19, 15, 0.1);
          border: 1px solid var(--soft);
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-card:hover,
        .category-card.active {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(21, 19, 15, 0.15);
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .category-icon {
          font-size: 2rem;
        }

        .category-card h3 {
          font-size: 1.3rem;
          color: var(--dark);
        }

        .category-card p {
          color: #4c453d;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .category-topics {
          border-top: 1px solid var(--soft);
          padding-top: 1rem;
        }

        .topic-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          color: #666;
        }

        .topic-item span:first-child {
          color: var(--accent);
          font-weight: bold;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .faq-item {
          background: var(--white);
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid var(--soft);
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          padding: 1.5rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--dark);
          transition: background 0.2s;
        }

        .faq-question:hover {
          background: var(--cream);
        }

        .faq-question.expanded {
          background: var(--cream);
          font-weight: 600;
        }

        .faq-toggle {
          font-size: 1.5rem;
          color: var(--accent);
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          color: #4c453d;
          line-height: 1.6;
        }

        .contact-form-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-form {
          background: var(--white);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(21, 19, 15, 0.1);
          border: 1px solid var(--soft);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--dark);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--soft);
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group textarea {
          resize: vertical;
        }

        @media (max-width: 768px) {
          .support-hero {
            padding: 2rem 1.5rem;
          }

          .support-hero h1 {
            font-size: 2rem;
          }

          .contact-options {
            grid-template-columns: 1fr;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .contact-form {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
