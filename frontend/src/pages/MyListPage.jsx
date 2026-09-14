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

import AppShell from "@/components/layout/AppShell";
import ContentRail from "@/components/media/ContentRail";
import { useProfiles } from "@/hooks/useProfiles";

import {
  getLibrary,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

import {
  downloadMedia,
} from "@/utils/mediaDownload";

export default function MyListPage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();

  const [library, setLibrary] = useState({
    continueWatching: [],
    recentlyWatched: [],
    myList: [],
    liked: [],
  });

  const loadLibrary = useCallback(async () => {
    if (!currentProfile) return;

    setLibrary(
      await getLibrary(currentProfile)
    );
  }, [currentProfile]);

  useEffect(() => {
    loadLibrary().catch((error) => {
      toast.error(
        error.response?.data?.message ||
          error.message
      );
    });
  }, [loadLibrary]);

  async function changeList(item) {
    const added = await toggleMyList(
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

  function download(item) {
    const result = downloadMedia(item);

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }
  }

  const open = (item) =>
    navigate(`/title/${item.slug}`);

  const play = (item) =>
    navigate(`/watch/${item.slug}`);

  return (
    <AppShell>
      <section className="box-container pb-7 pt-28 sm:pt-32">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
          YOUR SPACE
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
          My 24/7Box
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[#747474]">
          Your profile uses the real MySQL account session and live movie metadata.
          Saved and liked movie state stays profile-local until those backend write
          endpoints are added.
        </p>
      </section>

      <ContentRail
        title="My List"
        items={library.myList}
        onDetails={open}
        onPlay={play}
        onAdd={changeList}
        onLike={changeLike}
        onDownload={download}
      />

      <ContentRail
        title="Liked"
        items={library.liked}
        onDetails={open}
        onPlay={play}
        onAdd={changeList}
        onLike={changeLike}
        onDownload={download}
      />

      {!library.myList.length &&
        !library.liked.length && (
          <div className="box-container py-20 text-center">
            <h2 className="font-display text-2xl font-bold">
              Your space is ready.
            </h2>

            <p className="mt-2 text-sm text-[#747474]">
              Add a movie to your list and it will appear here.
            </p>
          </div>
        )}
    </AppShell>
  );
}
