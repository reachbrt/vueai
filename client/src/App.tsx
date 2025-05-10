import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Chatbot from "@/pages/Chatbot";
import Autosuggest from "@/pages/Autosuggest";
import SmartForm from "@/pages/SmartForm";
import Sidebar from "@/components/layout/Sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chatbot" component={Chatbot} />
      <Route path="/autosuggest" component={Autosuggest} />
      <Route path="/smartform" component={SmartForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for desktop */}
        {!isMobile && <Sidebar />}
        
        {/* Mobile sidebar */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 z-50 w-64 animate-in slide-in-from-left">
              <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <div className="fixed bottom-4 right-4 z-10">
            <Button 
              size="icon"
              variant="default"
              className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <Router />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
