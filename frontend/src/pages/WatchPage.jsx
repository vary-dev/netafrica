import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router";

import {
  getTitle,
} from "@/services/contentService";

import {
  useProfiles,
} from "@/hooks/useProfiles";

function youtubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id
        ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
        : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id
        ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

function vimeoEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("vimeo.com")) {
      return null;
    }

    const id = parsed.pathname.split("/").filter(Boolean).at(-1);

    return id
      ? `https://player.vimeo.com/video/${id}?autoplay=1`
      : null;
  } catch {
    return null;
  }
}

export default function WatchPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerError, setPlayerError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");
    setPlayerError(false);

    getTitle(slug, currentProfile)
      .then((result) => {
        if (active) setItem(result);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load this title."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, currentProfile]);

  const embedUrl = useMemo(
    () =>
      youtubeEmbedUrl(item?.videoUrl) ||
      vimeoEmbedUrl(item?.videoUrl),
    [item?.videoUrl]
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="size-8 animate-spin text-[#FFD900]" />
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <div className="max-w-lg text-center">
          <AlertCircle className="mx-auto size-10 text-[#FFD900]" />
          <h1 className="mt-5 font-display text-3xl font-bold">
            Unable to open this title
          </h1>
          <p className="mt-3 text-sm text-[#888]">
            {error || "The movie was not returned by the API."}
          </p>
          <BackButton onClick={() => navigate(-1)} />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {item.backdropUrl && (
        <img
          src={item.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-20 blur-2xl"
        />
      )}

      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-4 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:bg-white/15"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="min-w-0 text-right">
            <p className="truncate font-display text-sm font-bold sm:text-base">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs text-[#777]">
              {item.runtimeLabel || "24/7Box"}
            </p>
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center px-3 pb-7 sm:px-6">
          <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#050505] shadow-2xl shadow-black">
            {item.videoUrl ? (
              embedUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    title={item.title}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  key={item.videoUrl}
                  src={item.videoUrl}
                  poster={item.backdropUrl || item.posterUrl || undefined}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onError={() => setPlayerError(true)}
                  className="aspect-video w-full bg-black object-contain"
                >
                  Your browser does not support HTML5 video.
                </video>
              )
            ) : (
              <NoSource item={item} />
            )}

            {playerError && (
              <div className="border-t border-white/10 bg-[#101010] p-4 text-sm text-[#FF7777]">
                The browser could not play this video URL. Make sure the backend
                returns a direct MP4, WebM, Cloudinary video, YouTube, or Vimeo URL
                that is accessible from the browser.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function NoSource({ item }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-[#0b0b0b]">
      {item.backdropUrl && (
        <img
          src={item.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
      )}

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative flex h-full items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <AlertCircle className="mx-auto size-10 text-[#FFD900]" />
          <h2 className="mt-4 font-display text-2xl font-bold">
            Video not linked yet
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#aaa]">
            The API returned this movie and its artwork, but
            <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-[#FFD900]">
              videoUrl
            </code>
            is currently null.
          </p>
        </div>
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 rounded-xl bg-[#FFD900] px-5 py-2.5 text-sm font-bold text-black"
    >
      Go back
    </button>
  );
}
