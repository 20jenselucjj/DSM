import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

// Eager load only the home page
import Index from "./pages/Index";

// Lazy load all other pages
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ATPortal = lazy(() => import("./pages/ATPortal"));
const CoverageReport = lazy(() => import("./pages/CoverageReport"));
const Timesheet = lazy(() => import("./pages/Timesheet"));
const EventSchedule = lazy(() => import("./pages/EventSchedule"));
const ContactCoordinator = lazy(() => import("./pages/ContactCoordinator"));
const TrainerLogin = lazy(() => import("./pages/TrainerLogin"));
const TrainerForgotPassword = lazy(() => import("./pages/TrainerForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const App = () => {
  useSessionTimeout();

  const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Index />} />

            {/* To make other pages editable, wrap them with EditablePageWrapper */}
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/at-portal" element={<ATPortal />} />

            {/* Auth routes for Athletic Trainers */}
            <Route path="/trainer/login" element={<TrainerLogin />} />
            {/* Registration disabled: accounts are created by admins in Appwrite */}
            <Route path="/trainer/forgot" element={<TrainerForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Portal pages */}
            <Route path="/coverage-report" element={<CoverageReport />} />
            <Route path="/timesheet" element={<Timesheet />} />
            <Route path="/event-schedule" element={<EventSchedule />} />
            <Route path="/contact-coordinator" element={<ContactCoordinator />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
