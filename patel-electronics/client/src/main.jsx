import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#b12704', background: '#fff5f5', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>App Crashed!</h1>
          <h3 style={{ marginTop: '1rem' }}>Error: {this.state.error?.message}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fdd', padding: '1rem' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
