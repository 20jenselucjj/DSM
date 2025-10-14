import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ATPortal from "./pages/ATPortal";
import CoverageReport from "./pages/CoverageReport";
import Timesheet from "./pages/Timesheet";
import EventSchedule from "./pages/EventSchedule";
import ContactCoordinator from "./pages/ContactCoordinator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/at-portal" element={<ATPortal />} />
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

export default App;
