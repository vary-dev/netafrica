export function ProfileReviewStep({
  data,
  onComplete,
}) {
  return (
    <section className="text-center">
      <p className="mb-3 text-sm font-medium text-[#C18A62]">
        ALMOST THERE
      </p>

      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        Meet {data.name}
      </h2>

      <div
        className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-3xl text-6xl"
        style={{
          background:
            data.avatar?.background,
        }}
      >
        {data.avatar?.emoji}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {data.genres.map((genre) => (
          <span
            key={genre}
            className="rounded-full bg-[#191919] px-3 py-1.5 text-xs text-neutral-300"
          >
            {genre}
          </span>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="mt-10 h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] font-semibold"
      >
        Create profile
      </button>
    </section>
  );
}