import { useState } from "react";
import { Plus, List, CheckCircle2, Circle, Trash2, Eye, Pencil } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { List as ListType, Task } from "@shared/schema";
import type { TaskFilterType } from "@/components/task-filter";
import { ViewListDescriptionDialog } from "@/components/view-list-description-dialog";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  selectedListId: string | null;
  onListSelect: (listId: string | null) => void;
  onAddList: () => void;
  onEditList?: (list: ListType) => void;
  taskFilter: TaskFilterType;
  onTaskFilterChange: (filter: TaskFilterType) => void;
}

export function AppSidebar({ selectedListId, onListSelect, onAddList, onEditList, taskFilter, onTaskFilterChange }: AppSidebarProps) {
  const { toast } = useToast();
  const [viewingList, setViewingList] = useState<ListType | null>(null);
  const { data: lists = [] } = useQuery<ListType[]>({
    queryKey: ["/api/lists"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const deleteListMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/lists/${id}`, undefined);
    },
    onSuccess: (_, deletedListId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      // Si la lista eliminada estaba seleccionada, volver a "Todas las tareas"
      if (selectedListId === deletedListId) {
        onListSelect(null);
      }
      
      toast({
        title: "Lista eliminada",
        description: "La lista se ha eliminado correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la lista",
        variant: "destructive",
      });
    },
  });

  const handleDeleteList = (list: ListType) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la lista "${list.name}"?`)) {
      deleteListMutation.mutate(list.id);
    }
  };

  const getTaskCount = (listId: string | null) => {
    if (listId === null) {
      return tasks.filter(t => !t.completed).length;
    }
    return tasks.filter(t => t.listId === listId && !t.completed).length;
  };

  return (
    <Sidebar collapsible="none">
      <SidebarHeader>
        <h1 className="text-lg font-semibold px-2 py-4">
          Gestor de tareas
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <h2 className={cn(
            "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2",
            "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"
          )}>
            Mis Tareas
          </h2>
          <SidebarGroupContent>
            <SidebarMenu role="group" aria-label="Filtros de tareas">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    onListSelect(null);
                    onTaskFilterChange("all");
                  }}
                  isActive={selectedListId === null && taskFilter === "all"}
                  aria-pressed={selectedListId === null && taskFilter === "all"}
                  data-testid="button-all-tasks"
                >
                  <List className="h-4 w-4" />
                  <span>Todas las tareas</span>
                  {getTaskCount(null) > 0 && (
                    <Badge variant="secondary" className="ml-auto" data-testid="badge-count-all">
                      {getTaskCount(null)}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    onListSelect(null);
                    onTaskFilterChange("pending");
                  }}
                  isActive={selectedListId === null && taskFilter === "pending"}
                  aria-pressed={selectedListId === null && taskFilter === "pending"}
                  data-testid="button-pending-tasks"
                >
                  <Circle className="h-4 w-4" />
                  <span>Pendientes</span>
                  {tasks.filter(t => !t.completed).length > 0 && (
                    <Badge variant="secondary" className="ml-auto" data-testid="badge-count-pending">
                      {tasks.filter(t => !t.completed).length}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    onListSelect(null);
                    onTaskFilterChange("completed");
                  }}
                  isActive={selectedListId === null && taskFilter === "completed"}
                  aria-pressed={selectedListId === null && taskFilter === "completed"}
                  data-testid="button-completed-tasks"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completadas</span>
                  {tasks.filter(t => t.completed).length > 0 && (
                    <Badge variant="secondary" className="ml-auto" data-testid="badge-count-completed">
                      {tasks.filter(t => t.completed).length}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <h2 className={cn(
            "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2",
            "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"
          )}>
            Listas
          </h2>
          <SidebarGroupContent>
            <SidebarMenu role="group" aria-label="Listas personalizadas">
              {lists.map((list) => (
                <SidebarMenuItem key={list.id}>
                  <div className="flex items-center gap-1 w-full">
                    <SidebarMenuButton
                      onClick={() => onListSelect(list.id)}
                      isActive={selectedListId === list.id}
                      aria-pressed={selectedListId === list.id}
                      data-testid={`button-list-${list.id}`}
                      className="flex-1"
                    >
                      <Circle
                        className="h-4 w-4"
                        style={{ color: list.color }}
                        fill={list.color}
                      />
                      <span>{list.name}</span>
                      {getTaskCount(list.id) > 0 && (
                        <Badge variant="secondary" className="ml-auto" data-testid={`badge-count-${list.id}`}>
                          {getTaskCount(list.id)}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                    {list.description && list.description.trim() && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingList(list)}
                        aria-label={`Ver descripción ${list.name}`}
                        data-testid={`button-view-description-${list.id}`}
                        className="h-8 w-8 shrink-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEditList && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditList(list)}
                        aria-label={`Editar lista ${list.name}`}
                        data-testid={`button-edit-list-${list.id}`}
                        className="h-8 w-8 shrink-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteList(list)}
                      aria-label={`Eliminar lista ${list.name}`}
                      data-testid={`button-delete-list-${list.id}`}
                      className="h-8 w-8 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          onClick={onAddList}
          variant="ghost"
          className="w-full justify-start gap-2"
          data-testid="button-add-list"
        >
          <Plus className="h-4 w-4" />
          Nueva lista
        </Button>
      </SidebarFooter>
      <ViewListDescriptionDialog
        list={viewingList}
        open={!!viewingList}
        onOpenChange={(open) => !open && setViewingList(null)}
      />
    </Sidebar>
  );
}
