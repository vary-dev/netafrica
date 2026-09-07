import { useNavigate } from "react-router";

import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export default function BrowsePage() {
  const {
    currentProfile,
    clearProfile,
  } = useProfile();

  const { logout } = useAuth();

  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#080808] p-10 text-white">
      <p className="text-sm text-[#C18A62]">
        STREAMING EXPERIENCE
      </p>

      <h1 className="mt-3 text-4xl font-bold">
        Welcome,
        {" "}
        {currentProfile?.name}
      </h1>

      <p className="mt-4 text-neutral-400">
        Our full cinematic streaming
        homepage will be built here next.
      </p>

      <div className="mt-10 flex gap-3">
        <button
          onClick={() => {
            clearProfile();
            navigate("/profiles");
          }}
          className="rounded-lg bg-[#191919] px-5 py-3"
        >
          Switch profile
        </button>

        <button
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          className="rounded-lg border border-white/15 px-5 py-3"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}