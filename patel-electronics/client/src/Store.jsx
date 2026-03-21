import { Link } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';

const storeLocations = [
  {
    id: 'mumbai-main',
    name: 'Mumbai Main Store',
    address: '123 Electronics Street, Andheri West, Mumbai 400053',
    phone: '+91 22 2345 6789',
    email: 'mumbai@patelelectronics.com',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    manager: 'Rajesh Kumar',
    services: ['Showroom', 'Service Center', 'Installation', 'Delivery']
  },
  {
    id: 'delhi-connaught',
    name: 'Delhi Connaught Place',
    address: '456 G Block, Connaught Place, New Delhi 110001',
    phone: '+91 11 2345 6789',
    email: 'delhi@patelelectronics.com',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    manager: 'Priya Sharma',
    services: ['Showroom', 'Service Center', 'Installation', 'Delivery', 'Corporate Sales']
  },
  {
    id: 'bangalore-whitefield',
    name: 'Bangalore Whitefield',
    address: '789 IT Park Road, Whitefield, Bangalore 560066',
    phone: '+91 80 2345 6789',
    email: 'bangalore@patelelectronics.com',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    manager: 'Arun Patel',
    services: ['Showroom', 'Service Center', 'Installation', 'Delivery']
  },
  {
    id: 'chennai-t-nagar',
    name: 'Chennai T. Nagar',
    address: '321 Thyagaraya Road, T. Nagar, Chennai 600017',
    phone: '+91 44 2345 6789',
    email: 'chennai@patelelectronics.com',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    manager: 'Meena Reddy',
    services: ['Showroom', 'Service Center', 'Installation', 'Delivery']
  },
  {
    id: 'hyderabad-banjara',
    name: 'Hyderabad Banjara Hills',
    address: '656 Road No. 12, Banjara Hills, Hyderabad 500034',
    phone: '+91 40 2345 6789',
    email: 'hyderabad@patelelectronics.com',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    manager: 'Suresh Kumar',
    services: ['Showroom', 'Service Center', 'Installation', 'Delivery']
  },
  {
    id: 'pune-koregaon',
    name: 'Pune Koregaon Park',
    address: '987 North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2345 6789',
    email: 'pune@patelelectronics.com',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    manager: 'Anita Desai',
    services: ['Showroom', 'Service Center', 'Installation', 'Delivery']
  }
];

export default function Store() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand">
          <Link to="/">Patel Electronics</Link>
        </div>
        <nav className="top-actions">
          <Link to="/stores" className="text-button active">Stores</Link>
          <Link to="/support" className="text-button">Support</Link>
          <Link to="/cart" className="text-button">Cart</Link>
          {isAuthenticated ? (
            <Link to="/profile" className="text-button">Profile</Link>
          ) : (
            <Link to="/login" className="text-button">Sign In</Link>
          )}
        </nav>
      </header>

      <div className="store-container">
        <section className="store-hero">
          <div className="store-hero-content">
            <h1>Visit Our Stores</h1>
            <p>Experience our premium electronics collection in person at any of our conveniently located stores across India.</p>
            <div className="store-stats">
              <div className="stat">
                <h3>6+</h3>
                <p>Major Cities</p>
              </div>
              <div className="stat">
                <h3>25+</h3>
                <p>Years of Service</p>
              </div>
              <div className="stat">
                <h3>100%</h3>
                <p>Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        <section className="store-locations">
          <div className="section-heading">
            <p className="eyebrow">Our Locations</p>
            <h2>Find a store near you</h2>
          </div>
          
          <div className="store-grid">
            {storeLocations.map((store) => (
              <article key={store.id} className="store-card">
                <div className="store-header">
                  <h3>{store.name}</h3>
                  <div className="store-services">
                    {store.services.map((service, index) => (
                      <span key={index} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>
                
                <div className="store-details">
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>{store.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📞</span>
                    <span>{store.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">✉️</span>
                    <span>{store.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">🕐</span>
                    <span>{store.hours}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">👤</span>
                    <span>Manager: {store.manager}</span>
                  </div>
                </div>

                <div className="store-actions">
                  <button className="primary">Get Directions</button>
                  <button className="ghost">Call Store</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="store-services-section">
          <div className="section-heading">
            <p className="eyebrow">Services</p>
            <h2>What we offer at our stores</h2>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏪</div>
              <h3>Showroom</h3>
              <p>Experience our products firsthand with expert guidance and personalized recommendations.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Service Center</h3>
              <p>Professional repair and maintenance services for all major appliance brands.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Installation</h3>
              <p>Expert installation services by certified technicians for optimal performance.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚚</div>
              <h3>Delivery</h3>
              <p>Safe and timely delivery with white-glove service for your peace of mind.</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .store-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .store-hero {
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          padding: 4rem 3rem;
          margin-bottom: 4rem;
          text-align: center;
          border: 1px solid var(--border);
        }

        .store-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .store-hero p {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        .store-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .store-stats .stat h3 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--accent);
        }

        .store-stats .stat p {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          margin-top: 0.5rem;
        }

        .section-heading {
          margin-bottom: 3rem;
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
          color: var(--text-main);
        }

        .store-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .store-card {
          background: var(--surface-glass);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
          transition: transform 0.3s;
        }

        .store-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.15);
        }

        .store-header {
          margin-bottom: 1.5rem;
        }

        .store-header h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .store-services {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .service-tag {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        .store-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .detail-item .icon {
          font-size: 1.1rem;
          width: 20px;
        }

        .store-actions {
          display: flex;
          gap: 1rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.15);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .service-card h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #fff, #999);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .service-card p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .store-hero {
            padding: 2rem 1.5rem;
          }

          .store-hero h1 {
            font-size: 2rem;
          }

          .store-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .store-grid {
            grid-template-columns: 1fr;
          }

          .store-actions {
            flex-direction: column;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
