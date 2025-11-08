import { useState, useRef } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchInput } from "@/components/search-input";
import { TaskFilterType } from "@/components/task-filter";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import Home, { type HomeRef } from "@/pages/home";
import NotFound from "@/pages/not-found";


export default function App() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState<TaskFilterType>("all");
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const homeRef = useRef<HomeRef>(null);

  const sidebarStyle = {
    "--sidebar-width": "280px",
    "--sidebar-width-icon": "4rem",
  };

  useKeyboardShortcuts({
    onFocusSearch: () => {
      searchInputRef.current?.focus();
    },
    onFocusNewTask: () => {
      setIsAddTaskOpen(true);
    },
    onNewList: () => {
      setIsAddListOpen(true);
    },
    onShowHelp: () => {
      setIsShortcutsHelpOpen(prev => !prev);
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <AppSidebar
            selectedListId={selectedListId}
            onListSelect={setSelectedListId}
            onAddList={() => setIsAddListOpen(true)}
            taskFilter={taskFilter}
            onTaskFilterChange={setTaskFilter}
          />
          <SidebarInset>
            <header className="flex items-center gap-4 p-4 border-b min-h-[57px]">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <SearchInput 
                ref={searchInputRef}
                value={searchQuery} 
                onChange={setSearchQuery} 
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsShortcutsHelpOpen(true)}
                aria-label="Mostrar atajos de teclado"
                data-testid="button-show-shortcuts"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </header>
            <main className="flex-1 overflow-hidden">
              <Switch>
                <Route path="/">
                  <Home
                    ref={homeRef}
                    selectedListId={selectedListId}
                    searchQuery={searchQuery}
                    taskFilter={taskFilter}
                    onAddListClick={() => setIsAddListOpen(true)}
                    isAddListOpen={isAddListOpen}
                    onAddListOpenChange={setIsAddListOpen}
                    isAddTaskOpen={isAddTaskOpen}
                    onAddTaskOpenChange={setIsAddTaskOpen}
                  />
                </Route>
                <Route component={NotFound} />
              </Switch>
            </main>
          </SidebarInset>
        </SidebarProvider>
        <KeyboardShortcutsHelp 
          open={isShortcutsHelpOpen}
          onOpenChange={setIsShortcutsHelpOpen}
        />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
