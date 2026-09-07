import { useState } from "react";

export function ProfileNameStep({
  data,
  updateForm,
  next,
}) {
  const [name, setName] =
    useState(data.name);

  function handleContinue() {
    if (!name.trim()) return;

    updateForm({
      name: name.trim(),
    });

    next();
  }

  return (
    <section>
      <p className="mb-3 text-sm font-medium text-[#C18A62]">
        STEP 01
      </p>

      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        Who's this profile for?
      </h2>

      <p className="mt-3 text-sm leading-6 text-neutral-400">
        Give this profile a name.
        Recommendations and watch activity
        will eventually be personalized for
        this person.
      </p>

      <input
        autoFocus
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleContinue();
          }
        }}
        placeholder="Profile name"
        className="mt-8 h-14 w-full rounded-xl border border-neutral-700 bg-[#121212] px-4 outline-none transition focus:border-[#A56243]"
      />

      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        className="mt-6 h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </section>
  );
}