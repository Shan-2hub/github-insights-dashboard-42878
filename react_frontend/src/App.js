import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import BlogPage from "./pages/BlogPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import DashboardHomePage from "./pages/DashboardHomePage";
import DashboardUserPage from "./pages/DashboardUserPage";
import DashboardRedirectPage from "./pages/DashboardRedirectPage";
import SettingsPage from "./pages/SettingsPage";
import SavedProfilesPage from "./pages/SavedProfilesPage";
import AdminPage from "./pages/AdminPage";

/**
 * React Query client for API state and caching.
 * Defaults are conservative to avoid spamming the backend/GitHub.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

// PUBLIC_INTERFACE
function App() {
  /** Application root. Sets up routing and query caching. */
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public portal (marketing + auth) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          {/* User/app portal */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="dashboard" element={<DashboardHomePage />} />
            <Route path="dashboard/:username" element={<DashboardUserPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="saved" element={<SavedProfilesPage />} />
          </Route>

          {/* Convenience route requested by spec */}
          <Route
            path="/dashboard/:username"
            element={
              <ProtectedRoute>
                <DashboardRedirectPage />
              </ProtectedRoute>
            }
          />

          {/* Admin portal (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
