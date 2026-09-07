import {
  createContext,
  useEffect,
  useState,
} from "react";

export const ProfileContext =
  createContext(null);

const STORAGE_KEY = "stream_profiles";

export function ProfileProvider({
  children,
}) {
  const [profiles, setProfiles] =
    useState([]);

  const [currentProfile, setCurrentProfile] =
    useState(null);

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      setProfiles(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profiles)
    );
  }, [profiles]);

  function createProfile(profile) {
    const newProfile = {
      id: crypto.randomUUID(),
      ...profile,
      createdAt:
        new Date().toISOString(),
    };

    setProfiles((current) => [
      ...current,
      newProfile,
    ]);

    return newProfile;
  }

  function selectProfile(profile) {
    setCurrentProfile(profile);
  }

  function clearProfile() {
    setCurrentProfile(null);
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        createProfile,
        selectProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}