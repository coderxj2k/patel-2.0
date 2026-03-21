# Patel Electronics - Clean Version

## 📁 Project Structure
```
patel-electronics/
├── client/                 # React frontend
│   ├── src/
│   │   ├── firebase-config.js     # Firebase configuration
│   │   ├── useFirebaseData.js     # Real-time data hooks
│   │   ├── admin-auth.jsx         # Admin authentication
│   │   ├── ProductManagement.jsx  # Product CRUD operations
│   │   ├── auth-context.jsx       # Customer auth context
│   │   ├── google-auth.js         # Google OAuth
│   │   ├── Login.jsx              # Login page
│   │   ├── Profile.jsx            # User profile
│   │   ├── AdminLogin.jsx         # Admin login
│   │   ├── AdminDashboard.jsx     # Admin dashboard
│   │   ├── App.jsx                # Main app component
│   │   └── ...                    # Other components
│   ├── package.json
│   └── public/
├── server/                # Node.js backend
│   ├── firebase.js         # Firebase admin setup
│   ├── index.js            # API server
│   ├── firebase-data.json  # Data for Firebase upload
│   ├── user-roles.json     # User roles configuration
│   ├── .env.example        # Environment variables template
│   └── package.json
└── README-CLEAN.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Client (React)
cd client
npm install

# Server (Node.js)
cd server
npm install
```

### 2. Firebase Setup
1. Create Firebase project
2. Update `firebase-config.js` with your Firebase config
3. Upload `firebase-data.json` to Firestore
4. Set up Firebase Authentication

### 3. Environment Variables
Copy `.env.example` to `.env` and update:
```bash
DEFAULT_ADMIN_EMAIL=admin@patelelectronics.com
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_SALES_EMAIL=sales@patelelectronics.com
DEFAULT_SALES_PASSWORD=sales123
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### 4. Run the Application
```bash
# Server (port 8080)
cd server
npm start

# Client (port 5173/5174)
cd client
npm run dev
```

## 🔐 Login Credentials

### Admin Access
- **Email**: admin@patelelectronics.com
- **Password**: admin123
- **Access**: Full admin dashboard and product management

### Sales Access  
- **Email**: sales@patelelectronics.com
- **Password**: sales123
- **Access**: Sales dashboard and order management

### Customer Access
- **Google OAuth**: Sign in with Google
- **Email/Password**: Create account or sign in

## 📊 Features

### Customer Features
- Product browsing and filtering
- Shopping cart with localStorage
- Order placement
- Google OAuth authentication
- User profiles

### Admin Features
- Product management (CRUD operations)
- Sales analytics
- Order management
- Customer management
- Real-time data updates

### Sales Features
- Order processing
- Customer management
- Sales analytics
- Order status updates

## 🔥 Firebase Integration

### Real-time Features
- Live product updates
- Real-time order tracking
- Multi-user synchronization
- Automatic data synchronization

### Collections
- `collections` - Product categories
- `products` - Product inventory
- `orders` - Customer orders
- `users` - User accounts
- `customers` - Customer data
- `sales` - Sales records
- `analytics` - Analytics data

## 📱 API Endpoints

### Customer APIs
- `GET /api/collections` - Get product categories
- `GET /api/products` - Get all products
- `POST /api/checkout` - Process checkout

### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/verify-token` - Verify admin session
- `GET /api/admin/users` - Get admin users

### Sales APIs
- `POST /api/sales/login` - Sales authentication
- `POST /api/sales/verify-token` - Verify sales session
- `GET /api/sales/users` - Get sales users

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router
- Firebase SDK
- Google OAuth
- CSS-in-JS

### Backend
- Node.js
- Express
- Firebase Admin SDK
- CORS
- dotenv

### Database
- Firebase Firestore
- Firebase Authentication
- Real-time Database

## 📝 Notes

- This is the clean, organized version
- All duplicate files removed
- Firebase real-time integration enabled
- Admin and sales authentication systems
- Product CRUD operations
- Responsive design
- Error handling and fallbacks

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy dist folder
3. Set environment variables

### Backend (Heroku/Railway)
1. Deploy Node.js server
2. Set environment variables
3. Configure Firebase service account

### Firebase
1. Enable Firestore Database
2. Enable Authentication
3. Upload initial data
4. Configure security rules
