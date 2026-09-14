const PREFIX = "247box_profile_preferences";

export const DEFAULT_PROFILE_PREFERENCES = {
  ageGroup: "18_PLUS",
  isKids: false,
  preferredGenres: [],
  preferredLanguage: "en",
  subtitleLanguage: "en",
  autoplayNextEpisode: true,
  autoplayPreviews: false,
};

function key(profileId) {
  return `${PREFIX}:${profileId}`;
}

export function getProfilePreferences(profileId) {
  try {
    const saved = JSON.parse(localStorage.getItem(key(profileId)) || "{}");

    return {
      ...DEFAULT_PROFILE_PREFERENCES,
      ...saved,
    };
  } catch {
    return { ...DEFAULT_PROFILE_PREFERENCES };
  }
}

export function saveProfilePreferences(profileId, preferences) {
  const next = {
    ...getProfilePreferences(profileId),
    ...preferences,
  };

  localStorage.setItem(key(profileId), JSON.stringify(next));
  return next;
}

export function removeProfilePreferences(profileId) {
  localStorage.removeItem(key(profileId));
}

export function hydrateBackendProfile(profile) {
  if (!profile) return null;

  return {
    ...profile,
    avatarUrl: profile.avatar || "",
    ...getProfilePreferences(profile.id),
  };
}
