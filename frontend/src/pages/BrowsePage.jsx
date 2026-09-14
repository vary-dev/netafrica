import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  KeyRound,
  Loader2,
  RefreshCcw,
  Server,
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
  Input,
} from "@/components/ui/input";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  useProfiles,
} from "@/hooks/useProfiles";

import {
  getHomeFeed,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

import {
  getBackendErrorMessage,
} from "@/services/backendAuthService";

function describeCatalogError(error) {
  const status = error?.response?.status;

  if (status === 502) {
    return {
      title: "The Node API is offline",
      message:
        "Vite could not reach the backend on port 5000. The new dev command starts it automatically, or you can run node server.js from the backend folder.",
    };
  }

  if (status === 401) {
    return {
      title: "Your API session expired",
      message:
        "Reconnect with your account password below to obtain a fresh JWT from Nganji's backend.",
    };
  }

  if (status === 404) {
    return {
      title: "The movie route is not in this backend checkout",
      message:
        "The API is reachable, but /api/content/movies is missing. Pull the backend version that implements the content routes from Nganji before retrying.",
    };
  }

  return {
    title: "Streaming catalog could not load",
    message: getBackendErrorMessage(error),
  };
}

export default function BrowsePage() {
  const navigate = useNavigate();

  const {
    user,
    backendReady,
    backendConnecting,
    backendError,
    connectBackend,
    refreshBackendState,
  } = useAuth();

  const {
    currentProfile,
  } = useProfiles();

  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);
  const [password, setPassword] = useState("");

  const loadFeed = useCallback(
    async (force = false) => {
      if (!currentProfile) return;

      if (!backendReady && !force) {
        setLoading(false);
        setFeed(null);
        setCatalogError(null);
        return;
      }

      setLoading(true);
      setCatalogError(null);

      try {
        setFeed(
          await getHomeFeed(currentProfile)
        );
      } catch (requestError) {
        console.error(
          "Unable to load Node/MySQL movie catalog:",
          requestError
        );

        if (requestError.response?.status === 401) {
          refreshBackendState();
        }

        setCatalogError(
          describeCatalogError(requestError)
        );
      } finally {
        setLoading(false);
      }
    },
    [
      currentProfile,
      backendReady,
      refreshBackendState,
    ]
  );

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  async function handleBackendConnect(event) {
    event.preventDefault();

    if (!password) {
      toast.error("Enter your account password first.");
      return;
    }

    try {
      await connectBackend({
        email: user?.email,
        password,
      });

      setPassword("");
      toast.success("Node/MySQL API connected. JWT session is ready.");
      await loadFeed(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

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

  if (!backendReady) {
    return (
      <AppShell>
        <BackendConnectionCard
          email={user?.email}
          password={password}
          setPassword={setPassword}
          connecting={backendConnecting}
          message={backendError}
          onSubmit={handleBackendConnect}
        />
      </AppShell>
    );
  }

  if (catalogError) {
    return (
      <AppShell>
        <section className="box-container flex min-h-[78vh] items-center justify-center pt-24">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-[#101010] p-8 text-center shadow-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#FFD900]/10 text-[#FFD900]">
              <AlertCircle size={22} />
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold">
              {catalogError.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#8b8b8b]">
              {catalogError.message}
            </p>

            <Button
              onClick={() => loadFeed(true)}
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

function BackendConnectionCard({
  email,
  password,
  setPassword,
  connecting,
  message,
  onSubmit,
}) {
  return (
    <section className="box-container flex min-h-[78vh] items-center justify-center pt-24">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#101010] p-7 shadow-2xl sm:p-9">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFD900]/10 text-[#FFD900]">
          <Server size={22} />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#FFD900]">
          NODE + MYSQL
        </p>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.035em]">
          Connect your streaming API
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#8b8b8b]">
          Firebase already knows who you are. Enter the same account password once
          so the frontend can request Nganji's temporary JWT and load the real movie
          catalog. The password is sent to the local Node API and is not stored by
          the frontend.
        </p>

        {message && (
          <div className="mt-5 rounded-xl border border-[#FFD900]/15 bg-[#FFD900]/5 px-4 py-3 text-xs leading-5 text-[#c8b968]">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-[#747474]">Account</p>
            <div className="rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-[#B8B8B8]">
              {email || "Firebase account"}
            </div>
          </div>

          <div>
            <label
              htmlFor="backend-password"
              className="mb-2 block text-xs font-semibold text-[#747474]"
            >
              Account password
            </label>

            <div className="relative">
              <KeyRound
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <Input
                id="backend-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter password to request backend JWT"
                className="h-12 rounded-xl border-white/10 bg-[#151515] pl-11 text-white focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={connecting || !password}
            className="h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
          >
            {connecting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Connecting API...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 size-4" />
                Get backend JWT
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
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
