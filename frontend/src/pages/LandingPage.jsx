import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  demoMovies,
} from "@/data/demoMovies";

import {
  getTrendingMovies,
} from "@/services/movieService";

import {
  useAuth,
} from "@/hooks/useAuth";

import AuthDialog
  from "@/components/auth/AuthDialog";

import LandingHeader
  from "@/components/landing/LandingHeader";

import HeroSection
  from "@/components/landing/HeroSection";

import TrendingRail
  from "@/components/landing/TrendingRail";

import ProfileShowcase
  from "@/components/landing/ProfileShowcase";

import FeatureSection
  from "@/components/landing/FeaturesSection";

import FinalCTA
  from "@/components/landing/FinalCTA";

import LandingFooter
  from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const navigate =
    useNavigate();

  const {
    user,
    initializing,
  } = useAuth();

  const [movies, setMovies] =
    useState(demoMovies);

  const [
    authDialog,
    setAuthDialog,
  ] = useState({
    open: false,
    mode: "login",
  });

  useEffect(() => {
    getTrendingMovies().then(
      setMovies
    );
  }, []);

  useEffect(() => {
    if (
      !initializing &&
      user
    ) {
      navigate(
        "/profiles"
      );
    }
  }, [
    user,
    initializing,
    navigate,
  ]);

  function openLogin() {
    setAuthDialog({
      open: true,
      mode: "login",
    });
  }

  function openRegister() {
    setAuthDialog({
      open: true,
      mode: "register",
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <LandingHeader
        onLogin={openLogin}
        onRegister={
          openRegister
        }
      />

      <HeroSection
        movie={movies[0]}
        onProtectedAction={
          openRegister
        }
      />

      <TrendingRail
        movies={movies}
        onProtectedAction={
          openRegister
        }
      />

      <ProfileShowcase
        onProtectedAction={
          openRegister
        }
      />

      <FeatureSection />

      <FinalCTA
        onStart={
          openRegister
        }
      />

      <LandingFooter />

      <AuthDialog
        key={authDialog.mode}
        open={authDialog.open}
        defaultMode={
          authDialog.mode
        }
        onOpenChange={(
          open
        ) =>
          setAuthDialog(
            (current) => ({
              ...current,
              open,
            })
          )
        }
        onSuccess={() =>
          navigate(
            "/profiles"
          )
        }
      />
    </main>
  );
}