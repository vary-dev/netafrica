import {
  ArrowRight,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Button,
} from "@/components/ui/button";

export default function FinalCTA({
  onStart,
}) {
  return (
    <section className="px-4 py-24">
      <div className="box-container overflow-hidden rounded-[28px] border border-[#FFD900]/15 bg-[radial-gradient(circle_at_80%_20%,rgba(255,217,0,.16),transparent_28%),#101010] px-6 py-16 text-center sm:px-12 sm:py-20">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
            24 HOURS. 7 DAYS.
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Your next story
            doesn't need to wait.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[#8b8b8b]">
            Create your account,
            choose your profile and
            make 24/7Box yours.
          </p>

          <Button
            onClick={onStart}
            className="mt-8 h-12 rounded-xl bg-[#FFD900] px-7 font-extrabold text-[#070707] hover:bg-[#FFE347]"
          >
            Create account

            <ArrowRight
              className="ml-2"
              size={17}
            />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}