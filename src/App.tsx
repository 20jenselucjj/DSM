import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSessionTimeout } from "@/hooks/use-session-timeout";
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/at-portal" element={<ATPortal />} />
          {/* Auth routes for Athletic Trainers */}
          <Route path="/trainer/login" element={<TrainerLogin />} />
          {/* Registration disabled: accounts are created by admins in Appwrite */}
          <Route path="/trainer/forgot" element={<TrainerForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/coverage-report" element={<CoverageReport />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/event-schedule" element={<EventSchedule />} />
          <Route path="/contact-coordinator" element={<ContactCoordinator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
