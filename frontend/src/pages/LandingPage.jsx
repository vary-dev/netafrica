import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { AuthDialog } from "@/components/auth/AuthDialog";

import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const [authOpen, setAuthOpen] =
    useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profiles");
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <LandingHeader
        onSignIn={() =>
          setAuthOpen(true)
        }
      />

      <LandingHero
        onStart={() =>
          setAuthOpen(true)
        }
      />

      {/*
        Coming next:
        PreviewRail
        ProfilesShowcase
        FeaturesSection
        DevicesSection
        LandingCTA
        Footer
      */}

      <AuthDialog
        open={authOpen}
        onClose={() =>
          setAuthOpen(false)
        }
      />
    </main>
  );
}