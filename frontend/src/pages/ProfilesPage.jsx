import {
  useState,
} from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { ProfileWizard } from "@/components/profile/ProfileWizard";

import { useProfile } from "@/hooks/useProfile";

export default function ProfilesPage() {
  const navigate = useNavigate();

  const {
    profiles,
    createProfile,
    selectProfile,
  } = useProfile();

  const [creating, setCreating] =
    useState(false);

  function handleCreate(data) {
    const profile =
      createProfile(data);

    selectProfile(profile);

    navigate("/browse");
  }

  if (creating) {
    return (
      <main className="flex min-h-screen items-center bg-[#080808] px-6 py-20 text-white">
        <ProfileWizard
          onComplete={handleCreate}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-6 text-white">
      <p className="text-sm font-medium text-[#C18A62]">
        YOUR SPACE
      </p>

      <h1 className="mt-3 text-center text-4xl font-bold tracking-tight md:text-5xl">
        Who's watching?
      </h1>

      <div className="mt-10 flex flex-wrap justify-center gap-7">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => {
              selectProfile(profile);
              navigate("/browse");
            }}
            className="group"
          >
            <div
              className="flex h-28 w-28 items-center justify-center rounded-2xl text-5xl transition duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-white"
              style={{
                background:
                  profile.avatar
                    ?.background,
              }}
            >
              {profile.avatar?.emoji}
            </div>

            <p className="mt-3 text-sm text-neutral-400 transition group-hover:text-white">
              {profile.name}
            </p>
          </button>
        ))}

        <button
          onClick={() =>
            setCreating(true)
          }
          className="group"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-neutral-700 bg-[#121212] transition group-hover:border-neutral-400">
            <Plus
              size={34}
              className="text-neutral-500 group-hover:text-white"
            />
          </div>

          <p className="mt-3 text-sm text-neutral-400">
            Add profile
          </p>
        </button>
      </div>
    </main>
  );
}