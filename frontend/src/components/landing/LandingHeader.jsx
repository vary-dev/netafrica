import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
  Search,
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
      {
        passive: true,
      }
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
            : "rgba(7,7,7,0)",
      }}
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-transparent
        backdrop-blur-md
      "
    >
      <div className="box-container flex h-[76px] items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="#">
            <img
              src={LOGO_URL}
              alt="24/7Box"
              className="h-9 w-auto"
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
              href="#trending"
              className="text-sm font-medium text-[#B8B8B8] transition hover:text-white"
            >
              Trending
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-[#B8B8B8] transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#profiles"
              className="text-sm font-medium text-[#B8B8B8] transition hover:text-white"
            >
              Profiles
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-white hover:bg-white/10 md:inline-flex"
          >
            <Search size={18} />
          </Button>

          <Button
            variant="ghost"
            onClick={onLogin}
            className="hidden text-white hover:bg-white/10 sm:inline-flex"
          >
            Sign in
          </Button>

          <Button
            onClick={onRegister}
            className="rounded-xl bg-[#FFD900] font-extrabold text-[#070707] hover:bg-[#FFE347]"
          >
            <UserRound
              size={16}
              className="mr-2 hidden sm:block"
            />

            Join 24/7Box
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 lg:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}