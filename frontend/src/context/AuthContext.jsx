import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/firebase/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function register(email, password) {
    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  async function loginWithGoogle() {
    return signInWithPopup(
      auth,
      googleProvider
    );
  }

  async function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}