import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/hooks/useAuth";
import SearchOverlay from "@/components/search/SearchOverlay";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

const navigation = [
  { to: "/browse", label: "Home" },
  { to: "/series", label: "Series" },
  { to: "/movies", label: "Movies" },
  { to: "/my-netflix", label: "My 24/7Box" },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentProfile, clearProfile } = useProfiles();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    clearProfile();
    await logout();
    navigate("/");
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#070707]/95 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent"
        }`}
      >
        <div className="box-container flex h-[72px] items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-10">
            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="shrink-0"
              aria-label="24/7Box home"
            >
              <img
                src={LOGO_URL}
                alt="24/7Box"
                className="h-8 w-auto sm:h-9"
              />
            </button>

            <nav className="hidden items-center gap-6 lg:flex">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#9a9a9a] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <span className="absolute inset-x-0 -bottom-1 mx-auto h-[2px] w-5 rounded-full bg-[#FFD900]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              className="rounded-xl text-white hover:bg-white/10 hover:text-[#FFD900]"
              aria-label="Search"
            >
              <Search size={19} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden rounded-xl text-white hover:bg-white/10 hover:text-[#FFD900] sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="ml-1 flex items-center gap-2 rounded-xl p-1.5 outline-none transition hover:bg-white/10"
                >
                  <Avatar className="size-8 rounded-lg border border-white/10">
                    <AvatarImage
                      src={currentProfile?.avatarUrl || ""}
                      alt={currentProfile?.name || "Profile"}
                    />
                    <AvatarFallback className="rounded-lg bg-[#FFD900] font-black text-[#070707]">
                      {currentProfile?.name?.slice(0, 1).toUpperCase() || "B"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    size={14}
                    className="hidden text-[#8b8b8b] sm:block"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 border-white/10 bg-[#101010]/98 p-2 text-white shadow-2xl backdrop-blur-xl"
              >
                <div className="px-2 py-2.5">
                  <p className="font-semibold">
                    {currentProfile?.name || "24/7Box profile"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#747474]">
                    Active viewing profile
                  </p>
                </div>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                  onClick={() => {
                    clearProfile();
                    navigate("/profiles");
                  }}
                  className="cursor-pointer"
                >
                  <Users className="mr-2 size-4" />
                  Switch profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 size-4" />
                  Profile settings
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-[#FF6262] focus:text-[#FF6262]"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
