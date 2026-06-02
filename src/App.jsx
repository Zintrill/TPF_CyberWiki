import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hotjar from "@hotjar/browser";
import ReactGA from "react-ga4";

import { AuthProvider } from "./context/AuthContext";
import AnalyticsListener from "./components/AnalyticsListener";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer, useToastController } from "./components/Toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OffensePage from "./pages/OffensePage";
import DefensePage from "./pages/DefensePage";
import ToolsPage from "./pages/ToolsPage";
import ArticlePage from "./pages/ArticlePage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

const HOTJAR_SITE_ID = Number(import.meta.env.VITE_HOTJAR_SITE_ID) || 0;
const HOTJAR_VERSION = 6;
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

function AppInner() {
  const toasts = useToastController();

  useEffect(() => {
    if (HOTJAR_SITE_ID > 0) Hotjar.init(HOTJAR_SITE_ID, HOTJAR_VERSION);
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  return (
    <>
      <BrowserRouter>
        <AnalyticsListener />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/offense" element={<OffensePage />} />
          <Route path="/defense" element={<DefensePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
