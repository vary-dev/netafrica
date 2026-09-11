import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import ContentRail from "@/components/media/ContentRail";
import { useProfiles } from "@/hooks/useProfiles";
import {
  getLibrary,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

export default function MyListPage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const [library, setLibrary] = useState({
    continueWatching: [],
    myList: [],
    liked: [],
  });

  const loadLibrary = useCallback(async () => {
    if (!currentProfile) return;
    setLibrary(await getLibrary(currentProfile));
  }, [currentProfile]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  async function changeList(item) {
    const added = await toggleMyList(currentProfile, item.id);
    toast.success(added ? "Added to My List" : "Removed from My List");
    await loadLibrary();
  }

  async function changeLike(item) {
    await toggleLike(currentProfile, item.id);
    await loadLibrary();
  }

  const open = (item) => navigate(`/title/${item.slug}`);

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
          Everything {currentProfile?.name || "you"} saved, liked or started watching.
        </p>
      </section>

      <ContentRail
        title="Continue Watching"
        items={library.continueWatching}
        variant="continue"
        onDetails={open}
        onPlay={(item) => toast.success(`Resuming ${item.title}`)}
      />

      <ContentRail
        title="My List"
        items={library.myList}
        onDetails={open}
        onAdd={changeList}
        onLike={changeLike}
      />

      <ContentRail
        title="Liked"
        items={library.liked}
        onDetails={open}
        onAdd={changeList}
        onLike={changeLike}
      />

      {!library.continueWatching.length &&
        !library.myList.length &&
        !library.liked.length && (
          <div className="box-container py-20 text-center">
            <h2 className="font-display text-2xl font-bold">
              Your space is ready.
            </h2>
            <p className="mt-2 text-sm text-[#747474]">
              Start watching or add something to your list and it will appear here.
            </p>
          </div>
        )}
    </AppShell>
  );
}
