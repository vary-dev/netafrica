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
  getBackendErrorMessage,
  hasBackendSession,
} from "@/services/backendAuthService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [backendReady, setBackendReady] = useState(hasBackendSession());
  const [backendConnecting, setBackendConnecting] = useState(false);
  const [backendError, setBackendError] = useState("");

  async function connectBackend({ email, password }) {
    setBackendConnecting(true);
    setBackendError("");

    try {
      await ensureBackendSession({
        email,
        password,
        createIfMissing: true,
      });

      setBackendReady(true);
      return true;
    } catch (error) {
      clearBackendSession();
      setBackendReady(false);

      const message = getBackendErrorMessage(error);
      setBackendError(message);

      console.warn(
        "Firebase is authenticated, but the Node/MySQL JWT session is unavailable:",
        message
      );

      const wrappedError = new Error(message);
      wrappedError.code = "backend/session-unavailable";
      wrappedError.originalError = error;
      throw wrappedError;
    } finally {
      setBackendConnecting(false);
    }
  }

  function refreshBackendState() {
    const ready = hasBackendSession();
    setBackendReady(ready);

    if (ready) {
      setBackendError("");
    }

    return ready;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            await ensureUserDocument(firebaseUser);
            setBackendReady(hasBackendSession());
          } else {
            clearBackendSession();
            setBackendReady(false);
            setBackendError("");
          }

          setUser(firebaseUser);
        } catch (error) {
          console.error("User synchronization failed:", error);
        } finally {
          setInitializing(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  async function register({ name, email, password }) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(credential.user, {
      displayName: name,
    });

    await ensureUserDocument(credential.user);

    try {
      await connectBackend({ email, password });
    } catch {
      // Firebase registration remains valid. The authenticated app exposes a
      // reconnect form so the Node JWT can be obtained without signing out.
    }

    return credential.user;
  }

  async function login({ email, password }) {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    await ensureUserDocument(credential.user);

    try {
      await connectBackend({ email, password });
    } catch {
      // Keep the Firebase session. BrowsePage will offer an explicit Node API
      // reconnect action instead of forcing the user to sign out again.
    }

    return credential.user;
  }

  async function loginWithGoogle() {
    clearBackendSession();
    setBackendReady(false);
    setBackendError(
      "Google sign-in cannot create Nganji's custom JWT yet. Connect the Node API with the account password from the app."
    );

    const credential = await signInWithPopup(
      auth,
      googleProvider
    );

    await ensureUserDocument(credential.user);
    return credential.user;
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    clearBackendSession();
    setBackendReady(false);
    setBackendError("");
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      backendReady,
      backendConnecting,
      backendError,
      isAuthenticated: Boolean(user),
      register,
      login,
      loginWithGoogle,
      resetPassword,
      logout,
      connectBackend,
      refreshBackendState,
    }),
    [
      user,
      initializing,
      backendReady,
      backendConnecting,
      backendError,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
