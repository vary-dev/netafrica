import {
  AuthProvider,
} from "@/context/AuthContext";

import {
  ProfileProvider,
} from "@/context/ProfileContext";

import {
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  Toaster,
} from "@/components/ui/sonner";

export default function AppProviders({
  children,
}) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <TooltipProvider>
          {children}

          <Toaster
            position="top-center"
            richColors
            closeButton
          />
        </TooltipProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}