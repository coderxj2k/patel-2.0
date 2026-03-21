import { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Real-time collections hook
export const useCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fallbackCollections = [
      { id: 'fabric-care', title: 'Fabric Care', description: 'Advanced washing systems for delicate textiles.' },
      { id: 'cold-storage', title: 'Cold Storage', description: 'Precision cooling for culinary preservation.' },
      { id: 'cooking-tech', title: 'Cooking Technology', description: 'Smart ovens and induction cooking systems.' },
      { id: 'air-care', title: 'Air Care', description: 'Purifiers and climate control solutions.' },
      { id: 'small-appliances', title: 'Small Appliances', description: 'Compact solutions for modern kitchens.' },
      { id: 'entertainment', title: 'Entertainment', description: 'Audio and visual entertainment systems.' }
    ];

    const executeFallback = () => {
      if (isMounted) {
        setCollections(fallbackCollections);
        setLoading(false);
      }
    };

    const failsafeTimeout = setTimeout(() => {
      executeFallback();
    }, 1500);

    const collectionsRef = collection(db, 'collections');
    const unsubscribe = onSnapshot(
      collectionsRef,
      (snapshot) => {
        if (!isMounted) return;
        clearTimeout(failsafeTimeout);
        const collectionsData = [];
        snapshot.forEach((doc) => {
          collectionsData.push({ id: doc.id, ...doc.data() });
        });
        if (collectionsData.length === 0) {
          executeFallback();
        } else {
          setCollections(collectionsData);
          setLoading(false);
        }
      },
      (error) => {
        if (!isMounted) return;
        clearTimeout(failsafeTimeout);
        console.error('Error fetching collections:', error);
        setError(error.message);
        executeFallback();
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimeout);
      unsubscribe();
    };
  }, []);

  return { collections, loading, error };
};

// Real-time products hook
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fallbackProducts = [
      {
        id: 'frostline-fridge',
        name: 'Frostline Smart Fridge',
        description: 'Counter-depth cooling with adaptive humidity drawers. Features a modern glass door and built-in ice maker.',
        price: 899,
        originalPrice: 1299,
        conditionRating: 'Good',
        damageDescription: 'Small scratch on the left side panel. Fully functional.',
        warranty: '1 Year Limited Warranty',
        category: 'Cold Storage',
        brand: 'Frostline',
        inStock: true,
        rating: 4.5,
        reviews: 218,
        image: 'https://images.unsplash.com/photo-1584243027496-9645097a0054?w=800&h=600&fit=crop'
      },
      {
        id: 'silkguard-washer',
        name: 'Silkguard High-Efficiency Washer',
        description: 'Ultra-quiet drum with steam cleaning for delicate fabrics. Wi-Fi enabled for smart cycles.',
        price: 499,
        originalPrice: 749,
        conditionRating: 'Fair',
        damageDescription: 'Dent on the front door. Operates normally without issues.',
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
        name: 'CinemaView 65" OLED 4K Smart TV',
        description: 'Ultra-thin OLED display with cinematic clarity, deep blacks, and Dolby Vision.',
        price: 1199,
        originalPrice: 1599,
        conditionRating: 'Good',
        damageDescription: 'Minor scuffs on the back casing. Screen is absolutely flawless.',
        warranty: '1 Year Limited Warranty',
        category: 'Entertainment',
        brand: 'CinemaView',
        inStock: true,
        rating: 4.8,
        reviews: 512,
        image: 'https://images.unsplash.com/photo-1596786350986-224a6375b5fa?w=800&h=600&fit=crop'
      },
      {
        id: 'airpure-pro',
        name: 'AirPure Pro Smart Purifier',
        description: 'HEPA filtration with smart air quality monitoring and quiet mode.',
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
      }
    ];

    const executeFallback = () => {
      if (isMounted) {
        setProducts(fallbackProducts);
        setLoading(false);
      }
    };

    // Failsafe: if Firebase hangs identically without throwing an error for 1.5 seconds, force fallback.
    const failsafeTimeout = setTimeout(() => {
      executeFallback();
    }, 1500);

    const productsRef = collection(db, 'products');
    
    // Real-time listener
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!isMounted) return;
        clearTimeout(failsafeTimeout);
        const productsData = [];
        snapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        
        if (productsData.length === 0) {
          executeFallback();
        } else {
          setProducts(productsData);
          setLoading(false);
        }
      },
      (error) => {
        if (!isMounted) return;
        clearTimeout(failsafeTimeout);
        console.error('Error fetching products:', error);
        setError(error.message);
        executeFallback();
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimeout);
      unsubscribe();
    };
  }, []);

  return { products, loading, error };
};

// CRUD operations for products
export const useProductCRUD = () => {
  const addProduct = async (productData) => {
    try {
      const productsRef = collection(db, 'products');
      const newProduct = {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = doc(productsRef, newProduct.id);
      await setDoc(docRef, newProduct);
      return { success: true, id: newProduct.id };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const productRef = doc(db, 'products', productId);
      const updatedProduct = {
        ...productData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(productRef, updatedProduct);
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  };

  return { addProduct, updateProduct, deleteProduct };
};

// Real-time orders hook
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    
    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const ordersData = [];
        snapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { orders, loading };
};

// Create order function
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, 'orders');
    const newOrder = {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = doc(ordersRef, `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await setDoc(docRef, newOrder);
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};
