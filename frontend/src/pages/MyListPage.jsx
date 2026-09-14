import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  toast,
} from "sonner";

import AppShell
  from "@/components/layout/AppShell";

import ContentRail
  from "@/components/media/ContentRail";

import {
  useProfiles,
} from "@/hooks/useProfiles";

import {
  getLibrary,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

export default function MyListPage() {
  const navigate =
    useNavigate();

  const {
    currentProfile,
  } = useProfiles();

  const [
    library,
    setLibrary,
  ] = useState({
    continueWatching: [],
    recentlyWatched: [],
    myList: [],
    liked: [],
  });

  const loadLibrary =
    useCallback(async () => {
      if (!currentProfile) return;

      setLibrary(
        await getLibrary(
          currentProfile
        )
      );
    }, [currentProfile]);

  useEffect(() => {
    loadLibrary().catch(
      (error) => {
        toast.error(
          error.response?.data?.message ||
            error.message
        );
      }
    );
  }, [loadLibrary]);

  async function changeList(item) {
    const added =
      await toggleMyList(
        currentProfile,
        item.id
      );

    toast.success(
      added
        ? "Added to My List"
        : "Removed from My List"
    );

    await loadLibrary();
  }

  async function changeLike(item) {
    await toggleLike(
      currentProfile,
      item.id
    );

    await loadLibrary();
  }

  const open = (item) =>
    navigate(
      `/title/${item.slug}`
    );

  const play = (item) =>
    navigate(
      `/watch/${item.slug}`
    );

  return (
    <AppShell>
      <section className="box-container pb-7 pt-32">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
          YOUR SPACE
        </p>

        <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.045em]">
          My 24/7Box
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[#747474]">
          Saved and liked state is temporary per Firebase profile until Nganji
          adds those write endpoints. The movie metadata itself comes from the
          real API.
        </p>
      </section>

      <ContentRail
        title="My List"
        items={library.myList}
        onDetails={open}
        onPlay={play}
        onAdd={changeList}
        onLike={changeLike}
      />

      <ContentRail
        title="Liked"
        items={library.liked}
        onDetails={open}
        onPlay={play}
        onAdd={changeList}
        onLike={changeLike}
      />

      {!library.myList.length &&
        !library.liked.length && (
          <div className="box-container py-20 text-center">
            <h2 className="font-display text-2xl font-bold">
              Your space is ready.
            </h2>

            <p className="mt-2 text-sm text-[#747474]">
              Add a real API movie to your list and it will appear here.
            </p>
          </div>
        )}
    </AppShell>
  );
}
