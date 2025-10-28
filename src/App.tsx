import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { useSessionTimeout } from "@/hooks/use-session-timeout";
import EditablePageWrapper from "@/components/EditablePageWrapper";
import AdminPanel from "@/components/AdminPanel";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ATPortal from "./pages/ATPortal";
import CoverageReport from "./pages/CoverageReport";
import Timesheet from "./pages/Timesheet";
import EventSchedule from "./pages/EventSchedule";
import ContactCoordinator from "./pages/ContactCoordinator";
import TrainerLogin from "./pages/TrainerLogin";
import TrainerForgotPassword from "./pages/TrainerForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => {
  useSessionTimeout();

  // Enable editing in development or for admin users
  // In production, you might want to check user role/permissions
  const enableEditing = import.meta.env.DEV; // Only enable in development

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Panel - Access all editable pages */}
            <Route path="/admin/editor" element={<AdminPanel />} />

            {/* Home page - already wrapped with EditablePageWrapper inside Index.tsx */}
            <Route path="/" element={<Index />} />

            {/* To make other pages editable, wrap them with EditablePageWrapper */}
            <Route
              path="/about"
              element={
                <EditablePageWrapper pageId="about" enableEdit={enableEditing}>
                  <About />
                </EditablePageWrapper>
              }
            />

            <Route
              path="/at-portal"
              element={
                <EditablePageWrapper
                  pageId="at-portal"
                  enableEdit={enableEditing}
                >
                  <ATPortal />
                </EditablePageWrapper>
              }
            />

            {/* Auth routes for Athletic Trainers */}
            <Route
              path="/trainer/login"
              element={
                <EditablePageWrapper
                  pageId="trainer-login"
                  enableEdit={enableEditing}
                >
                  <TrainerLogin />
                </EditablePageWrapper>
              }
            />
            {/* Registration disabled: accounts are created by admins in Appwrite */}
            <Route path="/trainer/forgot" element={<TrainerForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Wrap additional pages that need editing capability */}
            <Route
              path="/coverage-report"
              element={
                <EditablePageWrapper
                  pageId="coverage-report"
                  enableEdit={enableEditing}
                >
                  <CoverageReport />
                </EditablePageWrapper>
              }
            />

            <Route
              path="/timesheet"
              element={
                <EditablePageWrapper
                  pageId="timesheet"
                  enableEdit={enableEditing}
                >
                  <Timesheet />
                </EditablePageWrapper>
              }
            />

            <Route
              path="/event-schedule"
              element={
                <EditablePageWrapper
                  pageId="event-schedule"
                  enableEdit={enableEditing}
                >
                  <EventSchedule />
                </EditablePageWrapper>
              }
            />

            <Route
              path="/contact-coordinator"
              element={
                <EditablePageWrapper
                  pageId="contact-coordinator"
                  enableEdit={enableEditing}
                >
                  <ContactCoordinator />
                </EditablePageWrapper>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
