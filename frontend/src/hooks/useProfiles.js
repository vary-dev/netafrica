import { useContext } from "react";

import {
  ProfileContext,
} from "@/context/ProfileContext";

export function useProfiles() {
  const context =
    useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfiles must be used inside ProfileProvider."
    );
  }

  return context;
}