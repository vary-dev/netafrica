import {
  LogOut,
  Repeat2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import {
  Button,
} from "@/components/ui/button";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  useProfiles,
} from "@/hooks/useProfiles";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

export default function BrowsePage() {
  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const {
    currentProfile,
    clearProfile,
  } = useProfiles();

  return (
    <main className="min-h-screen bg-[#070707] p-6 text-white">
      <header className="box-container flex items-center justify-between py-5">
        <img
          src={LOGO_URL}
          alt="24/7Box"
          className="h-9"
        />

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              clearProfile();

              navigate(
                "/profiles"
              );
            }}
            className="text-[#B8B8B8] hover:bg-white/10 hover:text-white"
          >
            <Repeat2
              className="mr-2"
              size={17}
            />

            Switch profile
          </Button>

          <Button
            variant="ghost"
            onClick={async () => {
              await logout();

              navigate("/");
            }}
            className="text-[#B8B8B8] hover:bg-white/10 hover:text-white"
          >
            <LogOut
              className="mr-2"
              size={17}
            />

            Sign out
          </Button>
        </div>
      </header>

      <section className="box-container py-24">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
          24/7BOX
        </p>

        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.04em]">
          Welcome,
          {" "}
          {
            currentProfile
              ?.name
          }
          .
        </h1>

        <p className="mt-4 max-w-xl text-[#747474]">
          The full authenticated
          streaming home—featured
          movies, categories, My List,
          Continue Watching and
          personalized recommendations—
          will be implemented here next.
        </p>
      </section>
    </main>
  );
}