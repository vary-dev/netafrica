function isStreamingProvider(url) {
  if (!url) return false;

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname.includes("youtube.com") ||
      hostname.includes("youtu.be") ||
      hostname.includes("vimeo.com")
    );
  } catch {
    return false;
  }
}

function cloudinaryAttachmentUrl(url) {
  if (!url) return url;

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.includes("/video/upload/") &&
      !parsed.pathname.includes("/fl_attachment/")
    ) {
      parsed.pathname = parsed.pathname.replace(
        "/video/upload/",
        "/video/upload/fl_attachment/"
      );

      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}

export function canDownloadMedia(item) {
  return Boolean(item?.videoUrl && !isStreamingProvider(item.videoUrl));
}

export function downloadMedia(item) {
  if (!item?.videoUrl) {
    return {
      ok: false,
      message: "This title does not have a downloadable video source yet.",
    };
  }

  if (isStreamingProvider(item.videoUrl)) {
    return {
      ok: false,
      message: "This title uses a streaming provider, so direct download is unavailable.",
    };
  }

  const anchor = document.createElement("a");
  anchor.href = cloudinaryAttachmentUrl(item.videoUrl);
  anchor.download = `${item.slug || item.title || "247box-movie"}.mp4`;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  return {
    ok: true,
    message: "Download started.",
  };
}
