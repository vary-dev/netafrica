import AppHeader from "@/components/layout/AppHeader";
import MobileNav from "@/components/layout/MobileNav";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <AppHeader />
      <main className="pb-24 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
