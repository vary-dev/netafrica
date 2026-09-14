import { useState } from "react";
import {
  LogOut,
  Loader2,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { useProfiles } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileWizard from "@/components/profile/ProfileWizard";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

export default function ProfilesPage() {
  const navigate = useNavigate();
  const { account, logout } = useAuth();

  const {
    profiles,
    loading,
    createProfile,
    selectProfile,
    deleteProfile,
  } = useProfiles();

  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function handleCreate(data) {
    setSubmitting(true);

    try {
      const created = await createProfile(data);
      await selectProfile(created);

      toast.success("Profile created.");
      navigate("/browse");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not create profile."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSelect(profile) {
    try {
      setSubmitting(true);
      await selectProfile(profile);
      navigate("/browse");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "This profile could not be selected."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;

    try {
      setSubmitting(true);
      await deleteProfile(deleting.id);
      setDeleting(null);
      toast.success("Profile deleted.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not delete profile."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  if (creating) {
    return (
      <main className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
          <img src={LOGO_URL} alt="24/7Box" className="h-8 w-auto" />

          <button
            type="button"
            onClick={() => setCreating(false)}
            className="text-sm font-semibold text-[#777] transition hover:text-white"
          >
            Exit setup
          </button>
        </div>

        <ProfileWizard
          onCancel={() => setCreating(false)}
          onComplete={handleCreate}
        />

        {submitting && <BlockingLoader />}
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(255,217,0,.08),transparent_24%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-7">
        <img src={LOGO_URL} alt="24/7Box" className="h-8 w-auto" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-[#888]">
              Parent account
            </p>
            <p className="max-w-[220px] truncate text-xs text-[#555]">
              {account?.email}
            </p>
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleLogout}
            className="rounded-xl text-[#777] hover:bg-white/5 hover:text-white"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col items-center justify-center px-5 pb-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFD900]/10 text-[#FFD900]">
          <UserRound size={22} />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#FFD900]">
          CHOOSE YOUR SPACE
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
          Who's watching?
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[#666]">
          Every profile belongs to the same MySQL account but keeps its own
          viewing preferences in the frontend.
        </p>

        {loading ? (
          <Loader2 className="mt-14 size-8 animate-spin text-[#FFD900]" />
        ) : (
          <div className="mt-12 flex max-w-5xl flex-wrap justify-center gap-x-7 gap-y-10">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onSelect={() => handleSelect(profile)}
                onDelete={() => setDeleting(profile)}
                canDelete={profiles.length > 1}
              />
            ))}

            {profiles.length < 4 && (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="group w-[148px] text-center sm:w-[168px]"
              >
                <div className="flex aspect-square items-center justify-center rounded-[26px] border border-dashed border-white/15 bg-[#101010] transition group-hover:border-[#FFD900]/45 group-hover:bg-[#FFD900]/5">
                  <Plus
                    size={34}
                    className="text-[#555] transition group-hover:text-[#FFD900]"
                  />
                </div>

                <p className="mt-3 text-sm font-bold text-[#666] transition group-hover:text-white">
                  Add profile
                </p>
              </button>
            )}
          </div>
        )}

        <div className="mt-12 rounded-full border border-white/[0.06] bg-white/[0.025] px-4 py-2 text-[11px] text-[#555]">
          Maximum 4 profiles · New profiles require the parent account password
        </div>
      </section>

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#101010] p-7 text-left shadow-2xl">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#FF5252]/10 text-[#FF6262]">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-5 font-display text-2xl font-bold">
              Delete {deleting.name}?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#777]">
              This calls Nganji's DELETE /api/profiles/:id endpoint. The
              profile cannot be restored from the frontend.
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-xl border-white/10 bg-[#151515] text-white hover:bg-[#1a1a1a] hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-[#FF5252] font-bold text-white hover:bg-[#ff6666]"
              >
                Delete profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {submitting && <BlockingLoader />}
    </main>
  );
}

function BlockingLoader() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111] px-5 py-4 shadow-2xl">
        <Loader2 className="size-5 animate-spin text-[#FFD900]" />
        <span className="text-sm font-semibold text-white">
          Working...
        </span>
      </div>
    </div>
  );
}
