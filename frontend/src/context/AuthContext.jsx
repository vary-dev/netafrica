import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearBackendSession,
  getBackendAccount,
  hasBackendSession,
  loginBackendAccount,
  registerBackendAccount,
} from "@/services/backendAuthService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(() => getBackendAccount());
  const [initializing, setInitializing] = useState(true);

  const syncSession = useCallback(() => {
    setAccount(getBackendAccount());
  }, []);

  useEffect(() => {
    syncSession();
    setInitializing(false);

    function handleExpired() {
      setAccount(null);
    }

    function handleStorage(event) {
      if (
        event.key === "247box_backend_token" ||
        event.key === "247box_backend_account"
      ) {
        syncSession();
      }
    }

    window.addEventListener("247box:auth-expired", handleExpired);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("247box:auth-expired", handleExpired);
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncSession]);

  async function login({ email, password }) {
    const result = await loginBackendAccount({ email, password });
    setAccount(result.account);
    return result.account;
  }

  async function register({ email, password }) {
    const result = await registerBackendAccount({ email, password });
    setAccount(result.account);
    return result.account;
  }

  function logout() {
    clearBackendSession();
    setAccount(null);
  }

  const value = useMemo(
    () => ({
      account,
      user: account,
      initializing,
      backendReady: hasBackendSession(),
      isAuthenticated: Boolean(account),
      login,
      register,
      logout,
    }),
    [account, initializing]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
