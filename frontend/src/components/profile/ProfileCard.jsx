import {
  motion,
} from "motion/react";

export default function ProfileCard({
  profile,
  onClick,
}) {
  return (
    <motion.button
      whileHover={{
        y: -7,
      }}
      whileTap={{
        scale: 0.97,
      }}
      onClick={onClick}
      className="group text-center"
    >
      <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#151515] transition group-hover:border-[#FFD900]/60 sm:size-32">
        {profile.avatarUrl ? (
          <img
            src={
              profile.avatarUrl
            }
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-3xl font-bold text-[#FFD900]">
            {profile.name
              .slice(0, 1)
              .toUpperCase()}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#FFD900] transition-transform group-hover:scale-x-100" />
      </div>

      <p className="mt-3 max-w-28 truncate text-sm font-semibold text-[#B8B8B8] transition group-hover:text-white">
        {profile.name}
      </p>
    </motion.button>
  );
}