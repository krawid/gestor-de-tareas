import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchInput } from "@/components/search-input";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";


export default function App() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarStyle = {
    "--sidebar-width": "280px",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar
              selectedListId={selectedListId}
              onListSelect={setSelectedListId}
              onAddList={() => setIsAddListOpen(true)}
            />
            <div className="flex flex-col flex-1">
              <header className="flex items-center gap-4 p-4 border-b min-h-[57px]">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <SearchInput value={searchQuery} onChange={setSearchQuery} />
              </header>
              <main className="flex-1 overflow-hidden">
                <Switch>
                  <Route path="/">
                    <Home
                      selectedListId={selectedListId}
                      searchQuery={searchQuery}
                      onAddListClick={() => setIsAddListOpen(true)}
                      isAddListOpen={isAddListOpen}
                      onAddListOpenChange={setIsAddListOpen}
                    />
                  </Route>
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
