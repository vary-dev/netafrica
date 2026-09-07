import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const PROFILE_SLOTS = [
  "profile-1",
  "profile-2",
  "profile-3",
  "profile-4",
];

export async function getProfiles(uid) {
  const ref = collection(
    db,
    "users",
    uid,
    "profiles"
  );

  const q = query(
    ref,
    orderBy("createdAt", "asc")
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (profileDoc) => ({
      id: profileDoc.id,
      ...profileDoc.data(),
    })
  );
}

export async function createProfile(
  uid,
  profile
) {
  const profiles =
    await getProfiles(uid);

  const existingIds =
    profiles.map(
      (item) => item.id
    );

  const availableSlot =
    PROFILE_SLOTS.find(
      (slot) =>
        !existingIds.includes(slot)
    );

  if (!availableSlot) {
    throw new Error(
      "You already have the maximum of four profiles."
    );
  }

  const ref = doc(
    db,
    "users",
    uid,
    "profiles",
    availableSlot
  );

  const document = {
    ownerId: uid,

    name: profile.name,

    avatarUrl:
      profile.avatarUrl ?? "",

    avatarStyle:
      profile.avatarStyle ?? "yellow",

    profileType:
      profile.profileType ?? "adult",

    language:
      profile.language ?? "en",

    maturityRating:
      profile.maturityRating ?? "18+",

    preferredGenres:
      profile.preferredGenres ?? [],

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

  await setDoc(ref, document);

  return {
    id: availableSlot,
    ...document,
  };
}

export async function deleteProfile(
  uid,
  profileId
) {
  await deleteDoc(
    doc(
      db,
      "users",
      uid,
      "profiles",
      profileId
    )
  );
}