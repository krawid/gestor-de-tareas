import { Plus, List, CheckCircle2, Circle, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { List as ListType, Task } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  selectedListId: string | null;
  onListSelect: (listId: string | null) => void;
  onAddList: () => void;
}

export function AppSidebar({ selectedListId, onListSelect, onAddList }: AppSidebarProps) {
  const { toast } = useToast();
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <h2 className={cn(
            "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2",
            "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"
          )}>
            Mis Tareas
          </h2>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onListSelect(null)}
                  isActive={selectedListId === null}
                  aria-current={selectedListId === null ? "page" : undefined}
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
            <SidebarMenu>
              {lists.map((list) => (
                <SidebarMenuItem key={list.id}>
                  <div className="flex items-center gap-1 w-full">
                    <SidebarMenuButton
                      onClick={() => onListSelect(list.id)}
                      isActive={selectedListId === list.id}
                      aria-current={selectedListId === list.id ? "page" : undefined}
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
    </Sidebar>
  );
}
