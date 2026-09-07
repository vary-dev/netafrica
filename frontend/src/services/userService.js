import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export async function ensureUserDocument(
  firebaseUser
) {
  if (!firebaseUser) return null;

  const ref = doc(
    db,
    "users",
    firebaseUser.uid
  );

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: firebaseUser.uid,

      email:
        firebaseUser.email ?? "",

      displayName:
        firebaseUser.displayName ?? "",

      photoURL:
        firebaseUser.photoURL ?? "",

      role: "account_owner",

      plan: "free",

      subscriptionStatus: "inactive",

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      ref,
      {
        email:
          firebaseUser.email ?? "",

        displayName:
          firebaseUser.displayName ?? "",

        photoURL:
          firebaseUser.photoURL ?? "",

        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );
  }

  return ref;
}