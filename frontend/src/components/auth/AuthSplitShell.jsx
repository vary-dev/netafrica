import { Link } from "react-router";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clapperboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

const CINEMA_IMAGE =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=88";

export default function AuthSplitShell({
  children,
  eyebrow,
  title,
  description,
}) {
  return (
    <main className="min-h-screen bg-[#070707] text-white lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/[0.06] lg:block">
        <img
          src={CINEMA_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55 blur-[1px]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,.25),rgba(7,7,7,.7)),linear-gradient(to_top,#070707_0%,rgba(7,7,7,.2)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_24%,rgba(255,217,0,.17),transparent_26%)]" />

        <div className="relative z-10 flex min-h-screen flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="w-fit">
            <img src={LOGO_URL} alt="24/7Box" className="h-10 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-[#FFD900]/20 bg-[#FFD900]/10 text-[#FFD900] backdrop-blur-xl">
              <Clapperboard size={22} />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FFD900]">
              STREAM YOUR WAY
            </p>

            <h2 className="mt-4 font-display text-5xl font-bold leading-[0.98] tracking-[-0.05em] xl:text-6xl">
              One account.
              <br />
              Every story.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#c1c1c1]">
              Sign in once, choose a profile, and continue directly into the
              catalog powered by the Node.js + MySQL backend.
            </p>

            <div className="mt-8 grid gap-3">
              <Benefit icon={ShieldCheck} text="JWT-protected account and profile access" />
              <Benefit icon={Sparkles} text="Profile-specific discovery and preferences" />
              <Benefit icon={CheckCircle2} text="Real movie metadata and browser playback" />
            </div>
          </motion.div>

          <p className="text-xs text-white/40">
            24/7Box · Watch anywhere, anytime.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,217,0,.07),transparent_24%)] lg:hidden" />

        <div className="relative z-10 w-full max-w-md">
          <Link to="/" className="mb-10 block w-fit lg:hidden">
            <img src={LOGO_URL} alt="24/7Box" className="h-9 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD900]">
              {eyebrow}
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#777]">
              {description}
            </p>

            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function Benefit({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3 backdrop-blur-md">
      <Icon size={16} className="shrink-0 text-[#FFD900]" />
      <span className="text-sm text-[#d2d2d2]">{text}</span>
    </div>
  );
}
