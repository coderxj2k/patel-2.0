import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { getFirestore, initializeDefaultUsers } from './firebase.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

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
    price: 899,
    originalPrice: 1299,
    conditionRating: 'Good',
    damageDescription: 'Small scratch on the left side panel. Fully functional.',
    warranty: '1 Year Limited Warranty'
  },
  {
    id: 'airstream-ac',
    name: 'Airstream Climate System',
    description: 'Whisper-quiet climate control for modern spaces.',
    price: 699,
    originalPrice: 899,
    conditionRating: 'Like New',
    damageDescription: 'Open box return, no visible defects.',
    warranty: '2 Year Manufacturer Warranty'
  },
  {
    id: 'silkguard-washer',
    name: 'Silkguard Washer',
    description: 'Precision fabric care with steam sanitization.',
    price: 499,
    originalPrice: 749,
    conditionRating: 'Fair',
    damageDescription: 'Dent on the front door. Operates normally.',
    warranty: '6 Months Limited Warranty'
  },
  {
    id: 'cinema-view-oled',
    name: 'CinemaView OLED',
    description: 'Ultra-thin 65” display with cinematic clarity.',
    price: 1199,
    originalPrice: 1599,
    conditionRating: 'Good',
    damageDescription: 'Minor scuffs on the back casing. Screen is flawless.',
    warranty: '1 Year Limited Warranty'
  }
];

app.use(cors());
app.use(express.json());

app.get('/api/collections', async (req, res) => {
  const firestore = getFirestore();

  if (!firestore) {
    return res.json(fallbackCollections);
  }

  try {
    const snapshot = await firestore.collection('collections').get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (!data.length) {
      return res.json(fallbackCollections);
    }
    return res.json(data);
  } catch (error) {
    return res.json(fallbackCollections);
  }
});

app.get('/api/products', async (req, res) => {
  const firestore = getFirestore();

  if (!firestore) {
    return res.json(fallbackProducts);
  }

  try {
    const snapshot = await firestore.collection('products').get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (!data.length) {
      return res.json(fallbackProducts);
    }
    return res.json(data);
  } catch (error) {
    return res.json(fallbackProducts);
  }
});

app.post('/api/checkout', (req, res) => {
  const { items } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No items provided.' });
  }
  return res.json({
    status: 'success',
    message: 'Payment authorized (prototype).',
    reference: `demo-${Date.now()}`
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin authentication endpoints
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Email and password are required' 
    });
  }

  try {
    const { getAuth, verifyAdminUser } = await import('./firebase.js');
    const auth = getAuth();
    
    if (!auth) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Firebase Auth not configured' 
      });
    }

    // For demo purposes, check against default credentials
    // In production, you'd use Firebase Auth signInWithEmailAndPassword
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@patelelectronics.com';
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    if (email === defaultAdminEmail && password === defaultAdminPassword) {
      // Get or create the admin user in Firebase
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // Create the admin user if it doesn't exist
          const { createAdminUser } = await import('./firebase.js');
          userRecord = await createAdminUser(email, password, 'System Administrator');
        } else {
          throw error;
        }
      }

      // Verify admin status
      const adminVerification = await verifyAdminUser(userRecord.uid);
      
      if (adminVerification.isAdmin) {
        // Generate a simple token (in production, use Firebase custom tokens)
        const token = Buffer.from(JSON.stringify({
          uid: userRecord.uid,
          email: userRecord.email,
          role: 'admin',
          permissions: adminVerification.permissions,
          timestamp: Date.now()
        })).toString('base64');

        return res.json({
          status: 'success',
          message: 'Admin login successful',
          data: {
            user: {
              uid: userRecord.uid,
              email: userRecord.email,
              displayName: userRecord.displayName,
              role: 'admin',
              permissions: adminVerification.permissions
            },
            token: token
          }
        });
      } else {
        return res.status(403).json({ 
          status: 'error', 
          message: 'User does not have admin privileges' 
        });
      }
    } else {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid admin credentials' 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/admin/verify-token', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Token is required' 
    });
  }

  try {
    // Decode and verify the token (simplified for demo)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is recent (within 24 hours)
    const tokenAge = Date.now() - decoded.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Token expired' 
      });
    }

    // Verify user still has admin privileges
    const { verifyAdminUser } = await import('./firebase.js');
    const adminVerification = await verifyAdminUser(decoded.uid);
    
    if (adminVerification.isAdmin) {
      return res.json({
        status: 'success',
        message: 'Token is valid',
        data: {
          user: decoded
        }
      });
    } else {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Admin privileges revoked' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      status: 'error', 
      message: 'Invalid token' 
    });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const { getAllAdminUsers } = await import('./firebase.js');
    const adminUsers = await getAllAdminUsers();
    
    return res.json({
      status: 'success',
      data: {
        users: adminUsers.map(user => ({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          disabled: user.disabled,
          customClaims: user.customClaims
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch admin users' 
    });
  }
});

// Sales authentication endpoints
app.post('/api/sales/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Email and password are required' 
    });
  }

  try {
    const { getAuth, verifySalesUser } = await import('./firebase.js');
    const auth = getAuth();
    
    if (!auth) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Firebase Auth not configured' 
      });
    }

    // For demo purposes, check against default sales credentials
    const defaultSalesEmail = process.env.DEFAULT_SALES_EMAIL || 'sales@patelelectronics.com';
    const defaultSalesPassword = process.env.DEFAULT_SALES_PASSWORD || 'sales123';

    if (email === defaultSalesEmail && password === defaultSalesPassword) {
      // Get or create the sales user in Firebase
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // Create the sales user if it doesn't exist
          const { createSalesUser } = await import('./firebase.js');
          userRecord = await createSalesUser(email, password, 'Sales Representative');
        } else {
          throw error;
        }
      }

      // Verify sales status
      const salesVerification = await verifySalesUser(userRecord.uid);
      
      if (salesVerification.isSales) {
        // Generate a simple token
        const token = Buffer.from(JSON.stringify({
          uid: userRecord.uid,
          email: userRecord.email,
          role: 'sales',
          permissions: salesVerification.permissions,
          timestamp: Date.now()
        })).toString('base64');

        return res.json({
          status: 'success',
          message: 'Sales login successful',
          data: {
            user: {
              uid: userRecord.uid,
              email: userRecord.email,
              displayName: userRecord.displayName,
              role: 'sales',
              permissions: salesVerification.permissions
            },
            token: token
          }
        });
      } else {
        return res.status(403).json({ 
          status: 'error', 
          message: 'User does not have sales privileges' 
        });
      }
    } else {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid sales credentials' 
      });
    }
  } catch (error) {
    console.error('Sales login error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/sales/verify-token', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Token is required' 
    });
  }

  try {
    // Decode and verify the token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is recent (within 24 hours)
    const tokenAge = Date.now() - decoded.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Token expired' 
      });
    }

    // Verify user still has sales privileges
    const { verifySalesUser } = await import('./firebase.js');
    const salesVerification = await verifySalesUser(decoded.uid);
    
    if (salesVerification.isSales) {
      return res.json({
        status: 'success',
        message: 'Token is valid',
        data: {
          user: decoded
        }
      });
    } else {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Sales privileges revoked' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      status: 'error', 
      message: 'Invalid token' 
    });
  }
});

app.get('/api/sales/users', async (req, res) => {
  try {
    const { getAllSalesUsers } = await import('./firebase.js');
    const salesUsers = await getAllSalesUsers();
    
    return res.json({
      status: 'success',
      data: {
        users: salesUsers.map(user => ({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          disabled: user.disabled,
          customClaims: user.customClaims
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching sales users:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch sales users' 
    });
  }
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  
  // Initialize default admin and sales users
  try {
    await initializeDefaultUsers();
  } catch (error) {
    console.error('Failed to initialize default users:', error.message);
  }
});
