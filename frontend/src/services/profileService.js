import apiClient from "@/services/apiClient";
import {
  hydrateBackendProfile,
  removeProfilePreferences,
  saveProfilePreferences,
} from "@/services/profilePreferences";

function extractPreferences(profile) {
  return {
    ageGroup: profile.ageGroup,
    isKids: profile.isKids,
    preferredGenres: profile.preferredGenres,
    preferredLanguage: profile.preferredLanguage,
    subtitleLanguage: profile.subtitleLanguage,
    autoplayNextEpisode: profile.autoplayNextEpisode,
    autoplayPreviews: profile.autoplayPreviews,
  };
}

export async function getProfiles() {
  const response = await apiClient.get("/profiles");
  const profiles = response.data?.profiles ?? [];
  return profiles.map(hydrateBackendProfile);
}

export async function getProfile(profileId) {
  const response = await apiClient.get(`/profiles/${profileId}`);
  return hydrateBackendProfile(response.data?.profile);
}

export async function createProfile(profile) {
  const response = await apiClient.post("/profiles", {
    name: profile.name.trim(),
    password: profile.password,
    avatar: profile.avatarUrl || null,
  });

  const profileId = response.data?.profileId;

  if (!profileId) {
    throw new Error("The backend did not return the new profile id.");
  }

  saveProfilePreferences(profileId, extractPreferences(profile));
  return getProfile(profileId);
}

export async function updateProfilePreferences(profileId, changes) {
  const preferences = saveProfilePreferences(profileId, changes);
  const backendProfile = await getProfile(profileId);

  return {
    ...backendProfile,
    ...preferences,
  };
}

export async function deleteProfile(profileId) {
  await apiClient.delete(`/profiles/${profileId}`);
  removeProfilePreferences(profileId);
}
