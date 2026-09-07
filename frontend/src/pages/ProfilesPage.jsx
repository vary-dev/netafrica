import {
  useState,
} from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import {
  toast,
} from "sonner";

import {
  useProfiles,
} from "@/hooks/useProfiles";

import ProfileCard
  from "@/components/profile/ProfileCard";

import ProfileWizard
  from "@/components/profile/ProfileWizard";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

export default function ProfilesPage() {
  const navigate =
    useNavigate();

  const {
    profiles,
    loading,
    createProfile,
    selectProfile,
  } = useProfiles();

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  async function handleCreate(
    data
  ) {
    setSubmitting(true);

    try {
      const created =
        await createProfile(
          data
        );

      selectProfile(created);

      toast.success(
        "Profile created."
      );

      navigate("/browse");
    } catch (error) {
      toast.error(
        error.message
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (creating) {
    return (
      <main className="min-h-screen bg-[#070707] px-5 py-12 text-white">
        <img
          src={LOGO_URL}
          alt="24/7Box"
          className="mx-auto mb-14 h-9"
        />

        <ProfileWizard
          onCancel={() =>
            setCreating(false)
          }
          onComplete={
            handleCreate
          }
        />

        {submitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm">
            <Loader2 className="size-8 animate-spin text-[#FFD900]" />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#070707] px-5 py-16 text-white">
      <img
        src={LOGO_URL}
        alt="24/7Box"
        className="mb-12 h-10"
      />

      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
        YOUR SPACE
      </p>

      <h1 className="mt-3 text-center font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
        Who's watching?
      </h1>

      {loading ? (
        <Loader2 className="mt-14 size-8 animate-spin text-[#FFD900]" />
      ) : (
        <div className="mt-12 flex max-w-4xl flex-wrap justify-center gap-7">
          {profiles.map(
            (profile) => (
              <ProfileCard
                key={
                  profile.id
                }
                profile={
                  profile
                }
                onClick={() => {
                  selectProfile(
                    profile
                  );

                  navigate(
                    "/browse"
                  );
                }}
              />
            )
          )}

          {profiles.length <
            4 && (
            <button
              onClick={() =>
                setCreating(
                  true
                )
              }
              className="group text-center"
            >
              <div className="flex size-28 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#101010] transition group-hover:border-[#FFD900]/50 sm:size-32">
                <Plus
                  size={32}
                  className="text-[#747474] transition group-hover:text-[#FFD900]"
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-[#747474] group-hover:text-white">
                Add profile
              </p>
            </button>
          )}
        </div>
      )}

      <p className="mt-12 text-xs text-[#555]">
        Up to 4 profiles per
        main account.
      </p>
    </main>
  );
}