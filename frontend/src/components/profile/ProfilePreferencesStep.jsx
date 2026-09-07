const genres = [
  "Action",
  "Drama",
  "Comedy",
  "Sci-Fi",
  "Documentary",
  "Animation",
  "Thriller",
  "Romance",
];

export function ProfilePreferencesStep({
  data,
  updateForm,
  next,
}) {
  function toggleGenre(genre) {
    const exists =
      data.genres.includes(genre);

    updateForm({
      genres: exists
        ? data.genres.filter(
            (item) => item !== genre
          )
        : [...data.genres, genre],
    });
  }

  return (
    <section>
      <p className="mb-3 text-sm font-medium text-[#C18A62]">
        STEP 03
      </p>

      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        What does {data.name} enjoy?
      </h2>

      <p className="mt-3 text-neutral-400">
        Choose a few interests. Later these
        will help power recommendations.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {genres.map((genre) => {
          const selected =
            data.genres.includes(genre);

          return (
            <button
              key={genre}
              onClick={() =>
                toggleGenre(genre)
              }
              className={`rounded-full border px-5 py-3 text-sm transition ${
                selected
                  ? "border-[#A56243] bg-[#A56243]/15 text-white"
                  : "border-neutral-700 bg-[#121212] text-neutral-400 hover:border-neutral-500"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      <button
        onClick={next}
        className="mt-8 h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] font-semibold"
      >
        Continue
      </button>
    </section>
  );
}