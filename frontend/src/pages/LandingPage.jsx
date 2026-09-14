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
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
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
    </main>
  );
}
