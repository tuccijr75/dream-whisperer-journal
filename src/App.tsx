
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CalendarView from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import Meditation from "./pages/Meditation";
import Settings from "./pages/Settings";
import SharedDream from "./pages/SharedDream";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

const App = () => {
  // Create the query client inside the component with useState to ensure it's stable
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/calendar" element={<Layout><CalendarView /></Layout>} />
              <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
              <Route path="/meditation" element={<Layout><Meditation /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/shared-dream/:id" element={<SharedDream />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
