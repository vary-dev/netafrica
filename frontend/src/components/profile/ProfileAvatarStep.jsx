import { motion } from "motion/react";

import { avatarOptions } from "@/data/avatarOptions";

export function ProfileAvatarStep({
  data,
  updateForm,
  next,
}) {
  function chooseAvatar(avatar) {
    updateForm({
      avatar,
    });
  }

  return (
    <section>
      <p className="mb-3 text-sm font-medium text-[#C18A62]">
        STEP 02
      </p>

      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        Choose your look
      </h2>

      <p className="mt-3 text-neutral-400">
        Pick an avatar for {data.name}.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {avatarOptions.map((avatar) => {
          const selected =
            data.avatar?.id === avatar.id;

          return (
            <motion.button
              key={avatar.id}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() =>
                chooseAvatar(avatar)
              }
              className={`aspect-square rounded-2xl border p-2 transition ${
                selected
                  ? "border-[#C18A62]"
                  : "border-transparent"
              }`}
            >
              <div
                className="flex h-full items-center justify-center rounded-xl text-4xl"
                style={{
                  background:
                    avatar.background,
                }}
              >
                {avatar.emoji}
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        disabled={!data.avatar}
        onClick={next}
        className="mt-8 h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] font-semibold disabled:opacity-40"
      >
        Continue
      </button>
    </section>
  );
}