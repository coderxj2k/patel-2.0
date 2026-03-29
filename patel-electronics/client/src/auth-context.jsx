import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // True Firebase Observer
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      try {
        // Save Google User to DB as well! We use merge: true so it doesn't overwrite them if they login again
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          password: 'Google-Account', // Google users don't have separate passwords
          role: 'customer',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (dbErr) {
        console.error('Error saving Google user to Firestore:', dbErr);
        alert('Google Login successful, but database write failed: ' + dbErr.message);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to login with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      try {
        // Create user record in the database as requested
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          password: password, // Storing password explicitly as requested
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      } catch (dbErr) {
        console.error('Error saving user to Firestore:', dbErr);
        alert('Account created, but database write failed: ' + dbErr.message + '\n\nPlease check your Firestore Security Rules to allow writes!');
      }
    } catch (err) {
      console.error('Email signup error:', err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Email login error:', err);
      setError(err.message || 'Failed to login with email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
