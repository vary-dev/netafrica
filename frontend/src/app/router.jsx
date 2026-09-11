import {
  Navigate,
  createBrowserRouter,
} from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { useProfiles } from "@/hooks/useProfiles";
import LandingPage from "@/pages/LandingPage";
import ProfilesPage from "@/pages/ProfilesPage";
import BrowsePage from "@/pages/BrowsePage";
import MoviesPage from "@/pages/MoviesPage";
import SeriesPage from "@/pages/SeriesPage";
import MyListPage from "@/pages/MyListPage";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";
import DetailsPage from "@/pages/DetailsPage";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707]">
      <div className="size-7 animate-spin rounded-full border-2 border-white/15 border-t-[#FFD900]" />
    </div>
  );
}

function AuthenticatedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;

  return children;
}

function ProfileRoute({ children }) {
  const { currentProfile } = useProfiles();

  if (!currentProfile) {
    return <Navigate to="/profiles" replace />;
  }

  return children;
}

function ProtectedProfilePage({ children }) {
  return (
    <AuthenticatedRoute>
      <ProfileRoute>{children}</ProfileRoute>
    </AuthenticatedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/profiles",
    element: (
      <AuthenticatedRoute>
        <ProfilesPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/browse",
    element: (
      <ProtectedProfilePage>
        <BrowsePage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "/movies",
    element: (
      <ProtectedProfilePage>
        <MoviesPage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "/series",
    element: (
      <ProtectedProfilePage>
        <SeriesPage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "/my-netflix",
    element: (
      <ProtectedProfilePage>
        <MyListPage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedProfilePage>
        <SearchPage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedProfilePage>
        <SettingsPage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "/title/:slug",
    element: (
      <ProtectedProfilePage>
        <DetailsPage />
      </ProtectedProfilePage>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
