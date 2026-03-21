import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

let firestoreInstance = null;
let authInstance = null;
let rolesConfig = null;

// Load user roles configuration
try {
  const rolesPath = join(process.cwd(), 'user-roles.json');
  rolesConfig = JSON.parse(readFileSync(rolesPath, 'utf8'));
} catch (error) {
  console.warn('Could not load user-roles.json, using fallback configuration');
  rolesConfig = {
    roles: {
      admin: {
        displayName: 'System Administrator',
        defaultEmail: 'admin@patelelectronics.com',
        defaultPassword: 'admin123',
        permissions: ['read', 'write', 'delete', 'manage_sales', 'manage_products', 'view_analytics']
      },
      sales: {
        displayName: 'Sales Representative',
        defaultEmail: 'sales@patelelectronics.com',
        defaultPassword: 'sales123',
        permissions: ['read', 'write', 'manage_sales', 'view_analytics', 'process_orders']
      }
    }
  };
}

export const getFirestore = () => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_DATABASE_URL
  } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: FIREBASE_DATABASE_URL
    });
  }

  firestoreInstance = admin.firestore();
  return firestoreInstance;
};

export const getAuth = () => {
  if (authInstance) {
    return authInstance;
  }

  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_DATABASE_URL
  } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: FIREBASE_DATABASE_URL
    });
  }

  authInstance = admin.auth();
  return authInstance;
};

// Admin user management functions
export const createAdminUser = async (email, password, displayName) => {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: true,
      disabled: false
    });

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'admin',
      permissions: rolesConfig.roles.admin.permissions
    });

    return userRecord;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const verifyAdminUser = async (uid) => {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const userRecord = await auth.getUser(uid);
    const customClaims = userRecord.customClaims || {};
    
    return {
      isAdmin: customClaims.role === 'admin',
      permissions: customClaims.permissions || [],
      user: userRecord
    };
  } catch (error) {
    console.error('Error verifying admin user:', error);
    return {
      isAdmin: false,
      permissions: [],
      user: null
    };
  }
};

export const getAllAdminUsers = async () => {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const listUsersResult = await auth.listUsers(1000);
    const adminUsers = listUsersResult.users.filter(user => 
      user.customClaims && user.customClaims.role === 'admin'
    );

    return adminUsers;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

// Initialize default admin user
export const initializeDefaultAdmin = async () => {
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || rolesConfig.roles.admin.defaultEmail;
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || rolesConfig.roles.admin.defaultPassword;

  try {
    const auth = getAuth();
    if (!auth) {
      console.log('Firebase Auth not available, skipping admin initialization');
      return;
    }

    // Check if admin already exists
    try {
      await auth.getUserByEmail(defaultAdminEmail);
      console.log('Default admin user already exists');
    } catch (error) {
      // User doesn't exist, create it
      if (error.code === 'auth/user-not-found') {
        await createAdminUser(defaultAdminEmail, defaultAdminPassword, rolesConfig.roles.admin.displayName);
        console.log('Default admin user created successfully');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
};

// Sales user management functions
export const createSalesUser = async (email, password, displayName) => {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: true,
      disabled: false
    });

    // Set custom claims for sales role
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'sales',
      permissions: rolesConfig.roles.sales.permissions
    });

    return userRecord;
  } catch (error) {
    console.error('Error creating sales user:', error);
    throw error;
  }
};

export const verifySalesUser = async (uid) => {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const userRecord = await auth.getUser(uid);
    const customClaims = userRecord.customClaims || {};
    
    return {
      isSales: customClaims.role === 'sales',
      permissions: customClaims.permissions || [],
      user: userRecord
    };
  } catch (error) {
    console.error('Error verifying sales user:', error);
    return {
      isSales: false,
      permissions: [],
      user: null
    };
  }
};

export const getAllSalesUsers = async () => {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const listUsersResult = await auth.listUsers(1000);
    const salesUsers = listUsersResult.users.filter(user => 
      user.customClaims && user.customClaims.role === 'sales'
    );

    return salesUsers;
  } catch (error) {
    console.error('Error fetching sales users:', error);
    throw error;
  }
};

// Initialize default sales user
export const initializeDefaultSales = async () => {
  const defaultSalesEmail = process.env.DEFAULT_SALES_EMAIL || rolesConfig.roles.sales.defaultEmail;
  const defaultSalesPassword = process.env.DEFAULT_SALES_PASSWORD || rolesConfig.roles.sales.defaultPassword;

  try {
    const auth = getAuth();
    if (!auth) {
      console.log('Firebase Auth not available, skipping sales initialization');
      return;
    }

    // Check if sales user already exists
    try {
      await auth.getUserByEmail(defaultSalesEmail);
      console.log('Default sales user already exists');
    } catch (error) {
      // User doesn't exist, create it
      if (error.code === 'auth/user-not-found') {
        await createSalesUser(defaultSalesEmail, defaultSalesPassword, rolesConfig.roles.sales.displayName);
        console.log('Default sales user created successfully');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error initializing default sales:', error);
  }
};

// Initialize both admin and sales users
export const initializeDefaultUsers = async () => {
  await initializeDefaultAdmin();
  await initializeDefaultSales();
};

// Export roles configuration
export const getRolesConfig = () => {
  return rolesConfig;
};
