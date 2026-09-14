import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import ProfileShowcase from "@/components/landing/ProfileShowcase";
import FeatureSection from "@/components/landing/FeaturesSection";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate("/profiles", { replace: true });
    }
  }, [isAuthenticated, initializing, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_42%,rgba(255,217,0,.05),transparent_22%),radial-gradient(circle_at_88%_70%,rgba(255,255,255,.035),transparent_20%)]" />

      <div className="relative z-10">
        <LandingHeader
          onLogin={() => navigate("/login")}
          onRegister={() => navigate("/register")}
        />

        <HeroSection
          movie={null}
          onProtectedAction={() => navigate("/register")}
        />

        <ProfileShowcase
          onProtectedAction={() => navigate("/register")}
        />

        <FeatureSection />

        <FinalCTA
          onStart={() => navigate("/register")}
        />

        <LandingFooter />
      </div>
    </main>
  );
}
