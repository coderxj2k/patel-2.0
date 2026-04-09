import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';

export default function Invoice() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Invoice not found. No such order exists.');
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError('Error loading the invoice. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="invoice-loading">
        <div className="spinner"></div>
        <p>Loading Invoice Document...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="invoice-error">
        <h1>Invoice Error</h1>
        <p>{error}</p>
        <Link to="/" className="print-hide invoice-btn">Return Home</Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="invoice-container">
      {/* Non-printable action bar */}
      <div className="print-hide invoice-actions">
        <button onClick={handlePrint} className="invoice-btn btn-primary">
          🖨️ Print to PDF
        </button>
        <button onClick={() => window.close()} className="invoice-btn btn-secondary">
          Close Window
        </button>
      </div>

      <div className="invoice-paper">
        {/* Header Section */}
        <header className="invoice-header">
          <div className="invoice-brand">
            <h1>PATEL ELECTRONICS</h1>
            <p>123 Tech Avenue</p>
            <p>Mumbai, Maharashtra 400001</p>
            <p>contact@patelelectronics.com</p>
          </div>
          <div className="invoice-metadata">
            <h2>INVOICE</h2>
            <table>
              <tbody>
                <tr>
                  <td><strong>Invoice #</strong></td>
                  <td>{order.id.split('-').pop().toUpperCase()}</td>
                </tr>
                <tr>
                  <td><strong>Date</strong></td>
                  <td>{orderDate}</td>
                </tr>
                <tr>
                  <td><strong>Status</strong></td>
                  <td style={{textTransform: 'capitalize'}}>{order.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </header>

        <hr className="invoice-divider" />

        {/* Customer Info Section */}
        <div className="invoice-customer">
          <h3>Billed To:</h3>
          <p><strong>{order.shippingAddress?.fullName || 'Customer Name'}</strong></p>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
          <p>Phone: {order.shippingAddress?.phone}</p>
          <p>Email: {order.customerEmail}</p>
        </div>

        {/* Products Table */}
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th className="align-left">Item Description</th>
              <th className="align-center">Qty</th>
              <th className="align-right">Unit Price</th>
              <th className="align-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index}>
                <td className="align-left">
                  <strong>{item.name}</strong>
                  <div className="item-meta">Brand: {item.brand}</div>
                </td>
                <td className="align-center">{item.quantity}</td>
                <td className="align-right">₹{item.price?.toLocaleString()}</td>
                <td className="align-right">₹{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="invoice-totals">
          <table className="totals-table">
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td className="align-right">₹{order.subtotal?.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td className="align-right">₹{order.shipping?.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Tax:</td>
                <td className="align-right">₹{order.tax?.toLocaleString()}</td>
              </tr>
              <tr className="totals-grand">
                <td><strong>Total amount due:</strong></td>
                <td className="align-right"><strong>₹{order.total?.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Payment Term Information */}
        <div className="invoice-footer">
          <h4>Payment Instructions</h4>
          <p>Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}</p>
          <p>Please make all checks payable to Patel Electronics Ltd.</p>
          <p className="thank-you">Thank you for your business!</p>
        </div>
      </div>

      <style jsx>{`
        /* Essential structure for screen viewing */
        .invoice-container {
          background-color: #f3f4f6;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333;
        }

        .invoice-actions {
          max-width: 800px;
          margin: 0 auto 1.5rem auto;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .invoice-btn {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: 0.2s all;
        }

        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        .btn-secondary:hover { background: #d1d5db; }

        /* Document Paper Setup */
        .invoice-paper {
          background: white;
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-radius: 0.5rem;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .invoice-brand h1 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin: 0 0 0.5rem 0;
          color: #111;
        }

        .invoice-brand p, .invoice-metadata p, .invoice-customer p {
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
          color: #555;
        }

        .invoice-metadata h2 {
          font-size: 2.2rem;
          color: #e5e7eb;
          text-align: right;
          margin: 0 0 1rem 0;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .invoice-metadata table {
          width: 100%;
        }

        .invoice-metadata td {
          padding: 0.25rem 0;
          font-size: 0.95rem;
        }

        .invoice-metadata td:last-child {
          text-align: right;
        }

        .invoice-divider {
          border: 0;
          border-top: 2px solid #f3f4f6;
          margin: 2rem 0;
        }

        .invoice-customer h3 {
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
          color: #111;
        }

        .invoice-customer strong {
          color: #000;
          font-size: 1.1rem;
        }

        /* Responsive Table */
        .invoice-items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
        }

        .invoice-items-table th {
          background-color: #f9fafb;
          color: #374151;
          font-weight: 600;
          padding: 0.75rem;
          border-bottom: 2px solid #e5e7eb;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .invoice-items-table td {
          padding: 1rem 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: top;
        }

        .item-meta {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .align-left { text-align: left; }
        .align-center { text-align: center; }
        .align-right { text-align: right; }

        /* Totals Block */
        .invoice-totals {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 3rem;
        }

        .totals-table {
          width: 300px;
          border-collapse: collapse;
        }

        .totals-table td {
          padding: 0.5rem 0;
          color: #555;
        }

        .totals-grand td {
          padding-top: 1rem;
          font-size: 1.25rem;
          color: #111;
          border-top: 2px solid #e5e7eb;
        }

        /* Footer Notes */
        .invoice-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .invoice-footer h4 {
          margin: 0 0 0.5rem 0;
          color: #111;
        }

        .invoice-footer p {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #555;
        }

        .thank-you {
          margin-top: 2rem !important;
          font-weight: 600;
          font-style: italic;
          text-align: center;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        .invoice-loading, .invoice-error {
          text-align: center;
          padding: 5rem 2rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* PURE PRINT MEDIA QUERIES */
        @media print {
          @page { size: auto; margin: 5mm; }
          body, html { width: 100%; height: 100%; margin: 0; padding: 0; background-color: white; }
          .invoice-container { padding: 0; background-color: transparent; }
          .invoice-paper { box-shadow: none; padding: 1rem; margin: 0; max-width: 100%; width: 100%; border-radius: 0; }
          .print-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
