import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing admin session on mount
    const savedAdmin = localStorage.getItem('patelElectronicsAdmin');
    
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        clearAdminData();
      }
    }
    
    setIsLoading(false);
  }, []);

  const loginAsAdmin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate admin authentication (in production, this would call your backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo admin credentials
      const adminCredentials = {
        email: 'admin@patelelectronics.com',
        password: 'admin123'
      };
      
      if (email === adminCredentials.email && password === adminCredentials.password) {
        const adminData = {
          id: 'admin_001',
          email: email,
          name: 'Admin User',
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'manage_sales', 'manage_products', 'view_analytics'],
          lastLogin: new Date().toISOString()
        };
        
        setAdmin(adminData);
        setIsAuthenticated(true);
        localStorage.setItem('patelElectronicsAdmin', JSON.stringify(adminData));
        
        return { success: true };
      } else {
        throw new Error('Invalid admin credentials');
      }
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Invalid email or password');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAdminData();
    setAdmin(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearAdminData = () => {
    localStorage.removeItem('patelElectronicsAdmin');
  };

  const hasPermission = (permission) => {
    return admin && admin.permissions && admin.permissions.includes(permission);
  };

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    error,
    loginAsAdmin,
    logout,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
