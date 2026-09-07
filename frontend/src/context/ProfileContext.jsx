import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/hooks/useAuth";

import {
  createProfile as createProfileDocument,
  getProfiles,
} from "@/services/profileService";

export const ProfileContext =
  createContext(null);

export function ProfileProvider({
  children,
}) {
  const { user } = useAuth();

  const [profiles, setProfiles] =
    useState([]);

  const [
    currentProfile,
    setCurrentProfile,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const loadProfiles =
    useCallback(async () => {
      if (!user) {
        setProfiles([]);
        return;
      }

      setLoading(true);

      try {
        const result =
          await getProfiles(user.uid);

        setProfiles(result);
      } finally {
        setLoading(false);
      }
    }, [user]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  async function createProfile(
    profile
  ) {
    if (!user) {
      throw new Error(
        "Authentication required."
      );
    }

    const created =
      await createProfileDocument(
        user.uid,
        profile
      );

    await loadProfiles();

    return created;
  }

  function selectProfile(profile) {
    setCurrentProfile(profile);

    sessionStorage.setItem(
      "247box_active_profile",
      JSON.stringify(profile)
    );
  }

  function clearProfile() {
    setCurrentProfile(null);

    sessionStorage.removeItem(
      "247box_active_profile"
    );
  }

  useEffect(() => {
    const stored =
      sessionStorage.getItem(
        "247box_active_profile"
      );

    if (!stored) return;

    try {
      setCurrentProfile(
        JSON.parse(stored)
      );
    } catch {
      sessionStorage.removeItem(
        "247box_active_profile"
      );
    }
  }, []);

  const value = useMemo(
    () => ({
      profiles,
      currentProfile,
      loading,

      refreshProfiles:
        loadProfiles,

      createProfile,
      selectProfile,
      clearProfile,
    }),
    [
      profiles,
      currentProfile,
      loading,
      loadProfiles,
    ]
  );

  return (
    <ProfileContext.Provider
      value={value}
    >
      {children}
    </ProfileContext.Provider>
  );
}