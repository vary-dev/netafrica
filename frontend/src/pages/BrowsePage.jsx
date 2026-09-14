import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import {
  toast,
} from "sonner";

import AppShell
  from "@/components/layout/AppShell";

import FeaturedHero
  from "@/components/media/FeaturedHero";

import ContentRail
  from "@/components/media/ContentRail";

import {
  Button,
} from "@/components/ui/button";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  useProfiles,
} from "@/hooks/useProfiles";

import {
  getHomeFeed,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

export default function BrowsePage() {
  const navigate =
    useNavigate();

  const {
    currentProfile,
  } = useProfiles();

  const [feed, setFeed] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadFeed =
    useCallback(async () => {
      if (!currentProfile) return;

      setLoading(true);
      setError("");

      try {
        setFeed(
          await getHomeFeed(
            currentProfile
          )
        );
      } catch (requestError) {
        console.error(
          "Unable to load Node/MySQL movie catalog:",
          requestError
        );

        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to load the movie catalog."
        );
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
    navigate(`/watch/${item.slug}`);
  }

  async function addToList(item) {
    const added = await toggleMyList(
      currentProfile,
      item.id
    );

    toast.success(
      added
        ? "Added to My 24/7Box"
        : "Removed from My 24/7Box"
    );

    await loadFeed();
  }

  async function like(item) {
    const liked = await toggleLike(
      currentProfile,
      item.id
    );

    toast.success(
      liked
        ? "We'll use this preference as personalization improves."
        : "Like removed."
    );

    await loadFeed();
  }

  if (loading) {
    return (
      <AppShell>
        <HomeSkeleton />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <section className="box-container flex min-h-[78vh] items-center justify-center pt-24">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-[#101010] p-8 text-center shadow-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#FFD900]/10 text-[#FFD900]">
              <AlertCircle size={22} />
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold">
              Streaming catalog isn't connected yet
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#8b8b8b]">
              {error}
            </p>

            <p className="mt-3 text-xs leading-5 text-[#666]">
              For this backend version, sign out and sign in once with email and
              password so 24/7Box can create the temporary Node/MySQL JWT session.
              Google-only login cannot use Nganji's current JWT middleware yet.
            </p>

            <Button
              onClick={loadFeed}
              className="mt-6 h-11 rounded-xl bg-[#FFD900] px-5 font-bold text-black hover:bg-[#FFE347]"
            >
              <RefreshCcw className="mr-2 size-4" />
              Retry API
            </Button>
          </div>
        </section>
      </AppShell>
    );
  }

  if (!feed?.featured) {
    return (
      <AppShell>
        <section className="box-container flex min-h-[70vh] items-center justify-center pt-24 text-center">
          <div>
            <h1 className="font-display text-3xl font-bold">
              No movies have been published yet.
            </h1>
            <p className="mt-3 text-sm text-[#747474]">
              Once the backend returns movies, they will appear here automatically.
            </p>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FeaturedHero
        content={feed.featured}
        onPlay={() => play(feed.featured)}
        onMoreInfo={() => openDetails(feed.featured)}
        onAdd={() => addToList(feed.featured)}
      />

      <div className="relative z-20 -mt-4 lg:-mt-8">
        {feed.rows.map((row) => (
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
