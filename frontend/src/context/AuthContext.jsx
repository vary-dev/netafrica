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

import {
  clearBackendSession,
  ensureBackendSession,
  hasBackendSession,
} from "@/services/backendAuthService";

export const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [initializing, setInitializing] =
    useState(true);

  const [
    backendReady,
    setBackendReady,
  ] = useState(
    hasBackendSession()
  );

  async function connectBackend({
    email,
    password,
  }) {
    try {
      await ensureBackendSession({
        email,
        password,
        createIfMissing: true,
      });

      setBackendReady(true);
      return true;
    } catch (error) {
      setBackendReady(false);

      console.warn(
        "Firebase sign-in succeeded, but the Node/MySQL API session could not be established:",
        error.response?.data?.message ||
          error.message
      );

      return false;
    }
  }

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
            } else {
              clearBackendSession();
              setBackendReady(false);
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

    await connectBackend({
      email,
      password,
    });

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

    await connectBackend({
      email,
      password,
    });

    return credential.user;
  }

  async function loginWithGoogle() {
    clearBackendSession();
    setBackendReady(false);

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
    clearBackendSession();
    setBackendReady(false);
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      backendReady,

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
      backendReady,
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
