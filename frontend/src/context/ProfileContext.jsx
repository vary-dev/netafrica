import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  createProfile as createBackendProfile,
  deleteProfile as deleteBackendProfile,
  getProfile,
  getProfiles,
  updateProfilePreferences,
} from "@/services/profileService";

export const ProfileContext = createContext(null);

const ACTIVE_PROFILE_KEY = "247box_active_profile_id";

export function ProfileProvider({ children }) {
  const { account } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async () => {
    if (!account) {
      setProfiles([]);
      setCurrentProfile(null);
      sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getProfiles();
      setProfiles(result);

      const storedId = sessionStorage.getItem(ACTIVE_PROFILE_KEY);

      if (!storedId) {
        setCurrentProfile(null);
        return;
      }

      const restored = result.find(
        (profile) => String(profile.id) === storedId
      );

      if (restored) {
        setCurrentProfile(restored);
      } else {
        sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
        setCurrentProfile(null);
      }
    } catch (error) {
      console.error("Unable to load backend profiles:", error);
      setProfiles([]);
      setCurrentProfile(null);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  async function createProfile(profile) {
    if (!account) throw new Error("Authentication required.");
    if (profiles.length >= 4) {
      throw new Error("This account already has four profiles.");
    }

    const created = await createBackendProfile(profile);
    await loadProfiles();
    return created;
  }

  async function selectProfile(profile) {
    if (!profile?.id) throw new Error("Invalid profile.");

    const verified = await getProfile(profile.id);

    setCurrentProfile(verified);
    sessionStorage.setItem(ACTIVE_PROFILE_KEY, String(verified.id));
    return verified;
  }

  async function updateProfile(profileId, changes) {
    const updated = await updateProfilePreferences(profileId, changes);

    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId ? updated : profile
      )
    );

    if (currentProfile?.id === profileId) {
      setCurrentProfile(updated);
    }

    return updated;
  }

  async function deleteProfile(profileId) {
    if (profiles.length <= 1) {
      throw new Error("Keep at least one profile on the account.");
    }

    await deleteBackendProfile(profileId);

    if (currentProfile?.id === profileId) {
      clearProfile();
    }

    await loadProfiles();
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
      selectProfile,
      updateProfile,
      deleteProfile,
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
