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
  updateProfile as updateProfileDocument,
} from "@/services/profileService";

export const ProfileContext = createContext(null);

const ACTIVE_PROFILE_KEY = "247box_active_profile";

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProfiles = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setCurrentProfile(null);
      sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
      return;
    }

    setLoading(true);

    try {
      const result = await getProfiles(user.uid);
      setProfiles(result);

      const stored = sessionStorage.getItem(ACTIVE_PROFILE_KEY);

      if (!stored) {
        setCurrentProfile(null);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const verified = result.find((profile) => profile.id === parsed?.id);

        if (verified) {
          setCurrentProfile(verified);
          sessionStorage.setItem(
            ACTIVE_PROFILE_KEY,
            JSON.stringify(verified)
          );
        } else {
          setCurrentProfile(null);
          sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
        }
      } catch {
        setCurrentProfile(null);
        sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    } catch (error) {
      console.error("Unable to load profiles:", error);
      setProfiles([]);
      setCurrentProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  async function createProfile(profile) {
    if (!user) throw new Error("Authentication required.");

    const created = await createProfileDocument(user.uid, profile);
    await loadProfiles();
    return created;
  }

  async function updateProfile(profileId, changes) {
    if (!user) throw new Error("Authentication required.");

    const updated = await updateProfileDocument(
      user.uid,
      profileId,
      changes
    );

    const nextChanges = {
      ...updated,
      ...changes,
    };

    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId
          ? { ...profile, ...nextChanges }
          : profile
      )
    );

    if (currentProfile?.id === profileId) {
      const nextProfile = {
        ...currentProfile,
        ...nextChanges,
      };

      setCurrentProfile(nextProfile);
      sessionStorage.setItem(
        ACTIVE_PROFILE_KEY,
        JSON.stringify(nextProfile)
      );
    }

    return nextChanges;
  }

  function selectProfile(profile) {
    const verified = profiles.find((item) => item.id === profile?.id);

    if (!verified) {
      throw new Error("That profile is not available for this account.");
    }

    setCurrentProfile(verified);
    sessionStorage.setItem(
      ACTIVE_PROFILE_KEY,
      JSON.stringify(verified)
    );
  }

  function clearProfile() {
    setCurrentProfile(null);
    sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
  }

  const value = useMemo(
    () => ({
      profiles,
      currentProfile,
      loading,
      refreshProfiles: loadProfiles,
      createProfile,
      updateProfile,
      selectProfile,
      clearProfile,
    }),
    [profiles, currentProfile, loading, loadProfiles]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
