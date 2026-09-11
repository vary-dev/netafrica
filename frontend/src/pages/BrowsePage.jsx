import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import FeaturedHero from "@/components/media/FeaturedHero";
import ContentRail from "@/components/media/ContentRail";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfiles } from "@/hooks/useProfiles";
import {
  getHomeFeed,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

export default function BrowsePage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeed = useCallback(async () => {
    if (!currentProfile) return;

    setLoading(true);
    try {
      setFeed(await getHomeFeed(currentProfile));
    } catch (error) {
      console.error("Unable to load personalized home feed:", error);
      toast.error("We could not load your home feed.");
    } finally {
      setLoading(false);
    }
  }, [currentProfile]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  function openDetails(item) {
    navigate(`/title/${item.slug}`);
  }

  function play(item) {
    toast.success(`Ready to play ${item.title}`, {
      description: "The player route can connect to the backend stream source next.",
    });
  }

  async function addToList(item) {
    const added = await toggleMyList(currentProfile, item.id);
    toast.success(added ? "Added to My 24/7Box" : "Removed from My 24/7Box");
    await loadFeed();
  }

  async function like(item) {
    const liked = await toggleLike(currentProfile, item.id);
    toast.success(liked ? "We'll use this to improve recommendations." : "Like removed.");
    await loadFeed();
  }

  if (loading) {
    return (
      <AppShell>
        <HomeSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FeaturedHero
        content={feed?.featured}
        onPlay={() => play(feed.featured)}
        onMoreInfo={() => openDetails(feed.featured)}
        onAdd={() => addToList(feed.featured)}
      />

      <div className="relative z-20 -mt-4 lg:-mt-8">
        {feed?.rows?.map((row) => (
          <ContentRail
            key={row.id}
            title={row.title}
            items={row.items}
            variant={row.variant}
            onDetails={openDetails}
            onPlay={play}
            onAdd={addToList}
            onLike={like}
          />
        ))}
      </div>
    </AppShell>
  );
}

function HomeSkeleton() {
  return (
    <div className="box-container pb-20 pt-24">
      <Skeleton className="h-[68vh] w-full rounded-[26px] bg-[#151515]" />
      <div className="mt-10 space-y-9">
        {[1, 2, 3].map((row) => (
          <div key={row}>
            <Skeleton className="mb-4 h-7 w-60 bg-[#151515]" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((card) => (
                <Skeleton
                  key={card}
                  className="aspect-video w-[260px] shrink-0 rounded-xl bg-[#151515]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
