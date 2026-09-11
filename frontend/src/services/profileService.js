import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import apiClient from "@/services/apiClient";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

const PROFILE_SLOTS = [
  "profile-1",
  "profile-2",
  "profile-3",
  "profile-4",
];

export async function getProfiles(uid) {
  if (useBackend) {
    const response = await apiClient.get("/profiles");
    return response.data.data;
  }

  const ref = collection(db, "users", uid, "profiles");
  const q = query(ref, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((profileDoc) => ({
    id: profileDoc.id,
    ...profileDoc.data(),
  }));
}

export async function createProfile(uid, profile) {
  if (useBackend) {
    const response = await apiClient.post("/profiles", profile);
    return response.data.data;
  }

  const profiles = await getProfiles(uid);
  const existingIds = profiles.map((item) => item.id);
  const availableSlot = PROFILE_SLOTS.find(
    (slot) => !existingIds.includes(slot)
  );

  if (!availableSlot) {
    throw new Error("You already have the maximum of four profiles.");
  }

  const ref = doc(db, "users", uid, "profiles", availableSlot);

  const document = {
    ownerId: uid,
    name: profile.name.trim(),
    avatarUrl: profile.avatarUrl ?? "",
    avatarStyle: profile.avatarStyle ?? "yellow",
    profileType: profile.isKids ? "kids" : profile.profileType ?? "adult",
    ageGroup: profile.ageGroup ?? "18_PLUS",
    isKids: Boolean(profile.isKids),
    maturityRating:
      profile.maturityRating ??
      (profile.ageGroup === "KIDS_7"
        ? "7+"
        : profile.ageGroup === "TEEN_13"
          ? "13+"
          : profile.ageGroup === "TEEN_16"
            ? "16+"
            : "18+"),
    preferredGenres: profile.preferredGenres ?? [],
    preferredLanguage: profile.preferredLanguage ?? "en",
    subtitleLanguage: profile.subtitleLanguage ?? "en",
    autoplayNextEpisode: profile.autoplayNextEpisode ?? true,
    autoplayPreviews: profile.autoplayPreviews ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, document);

  return {
    id: availableSlot,
    ...document,
  };
}

export async function updateProfile(uid, profileId, changes) {
  if (useBackend) {
    const response = await apiClient.patch(`/profiles/${profileId}`, changes);
    return response.data.data;
  }

  const ref = doc(db, "users", uid, "profiles", profileId);

  await updateDoc(ref, {
    ...changes,
    updatedAt: serverTimestamp(),
  });

  return {
    id: profileId,
    ...changes,
  };
}

export async function deleteProfile(uid, profileId) {
  if (useBackend) {
    await apiClient.delete(`/profiles/${profileId}`);
    return;
  }

  await deleteDoc(doc(db, "users", uid, "profiles", profileId));
}
