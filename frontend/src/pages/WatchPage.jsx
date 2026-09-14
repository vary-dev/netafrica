import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  Download,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router";

import {
  toast,
} from "sonner";

import {
  getTitle,
} from "@/services/contentService";

import {
  useProfiles,
} from "@/hooks/useProfiles";

import {
  downloadMedia,
} from "@/utils/mediaDownload";

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

  function download() {
    const result = downloadMedia(item);

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }
  }

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
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-25 blur-2xl"
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_15%,rgba(255,217,0,.08),transparent_22%),rgba(0,0,0,.78)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-3 p-3 sm:p-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 text-sm font-semibold backdrop-blur-md transition hover:border-[#FFD900]/30 hover:text-[#FFD900] sm:px-4"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="min-w-0 flex-1 px-2 text-center sm:px-4">
            <p className="truncate font-display text-sm font-bold sm:text-base">
              {item.title}
            </p>
            <p className="mt-0.5 hidden text-xs text-[#777] sm:block">
              {item.runtimeLabel || "24/7Box"}
            </p>
          </div>

          <button
            type="button"
            onClick={download}
            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#FFD900]/35 hover:bg-[#FFD900]/10 hover:text-[#FFD900] sm:px-4"
            aria-label="Download movie"
          >
            <Download size={17} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </header>

        <section className="flex flex-1 items-center justify-center px-2 pb-5 sm:px-6 sm:pb-7">
          <div className="w-full max-w-6xl overflow-hidden rounded-xl border border-white/10 bg-[#050505] shadow-2xl shadow-black sm:rounded-2xl">
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

      <div className="relative flex h-full items-center justify-center p-6 text-center sm:p-8">
        <div className="max-w-md">
          <AlertCircle className="mx-auto size-9 text-[#FFD900] sm:size-10" />
          <h2 className="mt-4 font-display text-xl font-bold sm:text-2xl">
            Video not linked yet
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#aaa] sm:text-sm sm:leading-6">
            This movie is available in the catalog, but its video source has not
            been linked by the backend yet.
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
