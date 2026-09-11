import {
  Clapperboard,
  Home,
  Search,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router";

const links = [
  { to: "/browse", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Clapperboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-netflix", label: "My Box", icon: UserRound },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-white/10 bg-[#101010]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold transition ${
                isActive
                  ? "bg-[#FFD900]/10 text-[#FFD900]"
                  : "text-[#777] hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
