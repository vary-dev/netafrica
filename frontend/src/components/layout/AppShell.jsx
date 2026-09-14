import AppHeader from "@/components/layout/AppHeader";
import MobileNav from "@/components/layout/MobileNav";

export default function AppShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070707] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,217,0,.055),transparent_24%),radial-gradient(circle_at_88%_28%,rgba(255,255,255,.035),transparent_22%),linear-gradient(to_bottom,#070707,#090909_48%,#070707)]" />

      <AppHeader />

      <main className="relative z-10 pb-24 lg:pb-0">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
