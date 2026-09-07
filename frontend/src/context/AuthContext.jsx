import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/firebase/firebase";

import {
  ensureUserDocument,
} from "@/services/userService";

export const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [initializing, setInitializing] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            if (firebaseUser) {
              await ensureUserDocument(
                firebaseUser
              );
            }

            setUser(firebaseUser);
          } catch (error) {
            console.error(
              "User synchronization failed:",
              error
            );
          } finally {
            setInitializing(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  async function register({
    name,
    email,
    password,
  }) {
    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await updateProfile(
      credential.user,
      {
        displayName: name,
      }
    );

    await ensureUserDocument(
      credential.user
    );

    return credential.user;
  }

  async function login({
    email,
    password,
  }) {
    const credential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    await ensureUserDocument(
      credential.user
    );

    return credential.user;
  }

  async function loginWithGoogle() {
    const credential =
      await signInWithPopup(
        auth,
        googleProvider
      );

    await ensureUserDocument(
      credential.user
    );

    return credential.user;
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(
      auth,
      email
    );
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,

      isAuthenticated:
        Boolean(user),

      register,
      login,
      loginWithGoogle,
      resetPassword,
      logout,
    }),
    [
      user,
      initializing,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}