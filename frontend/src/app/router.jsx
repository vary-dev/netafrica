import {
  Navigate,
  createBrowserRouter,
} from "react-router";

import LandingPage from "@/pages/LandingPage";
import ProfilesPage from "@/pages/ProfilesPage";
import BrowsePage from "@/pages/BrowsePage";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

function ProtectedRoute({
  children,
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

function ProfileProtectedRoute({
  children,
}) {
  const { currentProfile } =
    useProfile();

  if (!currentProfile) {
    return (
      <Navigate
        to="/profiles"
        replace
      />
    );
  }

  return children;
}

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },

    {
      path: "/profiles",
      element: (
        <ProtectedRoute>
          <ProfilesPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/browse",
      element: (
        <ProtectedRoute>
          <ProfileProtectedRoute>
            <BrowsePage />
          </ProfileProtectedRoute>
        </ProtectedRoute>
      ),
    },

    {
      path: "*",
      element: (
        <Navigate
          to="/"
          replace
        />
      ),
    },
  ]);