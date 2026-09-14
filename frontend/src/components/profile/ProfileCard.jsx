import {
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";

export default function ProfileCard({
  profile,
  onSelect,
  onDelete,
  canDelete = true,
}) {
  const initials =
    profile?.name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "24";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative w-[148px] sm:w-[168px]"
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left"
      >
        <div className="relative aspect-square overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#111] shadow-xl transition group-hover:border-[#FFD900]/40">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(255,217,0,.24),transparent_30%),linear-gradient(145deg,#171717,#0d0d0d)]">
              <span className="font-display text-4xl font-black text-[#FFD900]">
                {initials}
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-white/60">
              <ShieldCheck size={11} className="text-[#FFD900]" />
              {profile.isKids ? "Kids" : profile.ageGroup || "Profile"}
            </div>
          </div>
        </div>

        <p className="mt-3 truncate text-center font-display text-sm font-bold text-white">
          {profile.name}
        </p>
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white/60 opacity-0 backdrop-blur-md transition hover:border-[#FF5252]/30 hover:text-[#FF6A6A] group-hover:opacity-100"
          aria-label={`Delete ${profile.name}`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </motion.div>
  );
}
