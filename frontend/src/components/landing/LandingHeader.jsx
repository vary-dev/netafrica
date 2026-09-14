import {
  useEffect,
  useState,
} from "react";

import {
  UserRound,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Button,
} from "@/components/ui/button";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

export default function LandingHeader({
  onLogin,
  onRegister,
}) {
  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(
        window.scrollY > 24
      );
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <motion.header
      animate={{
        backgroundColor:
          scrolled
            ? "rgba(7,7,7,.92)"
            : "rgba(7,7,7,.14)",
      }}
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        scrolled
          ? "border-white/[0.06]"
          : "border-transparent"
      }`}
    >
      <div className="box-container flex h-[70px] items-center justify-between gap-4 sm:h-[76px]">
        <div className="flex min-w-0 items-center gap-10">
          <a href="#discover" className="shrink-0">
            <img
              src={LOGO_URL}
              alt="24/7Box"
              className="h-8 w-auto sm:h-9"
            />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#discover"
              className="text-sm font-semibold text-white"
            >
              Discover
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-[#A5A5A5] transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#profiles"
              className="text-sm font-medium text-[#A5A5A5] transition hover:text-white"
            >
              Profiles
            </a>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            onClick={onLogin}
            className="h-10 rounded-xl px-3 text-sm font-bold text-white hover:bg-white/10 hover:text-white sm:px-4"
          >
            Sign in
          </Button>

          <Button
            onClick={onRegister}
            className="h-10 rounded-xl bg-[#FFD900] px-3 font-extrabold text-[#070707] shadow-lg shadow-[#FFD900]/10 hover:bg-[#FFE347] sm:px-4"
          >
            <UserRound
              size={16}
              className="mr-2 hidden sm:block"
            />
            <span className="hidden sm:inline">Join 24/7Box</span>
            <span className="sm:hidden">Join</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
