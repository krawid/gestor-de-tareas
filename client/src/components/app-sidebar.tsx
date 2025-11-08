import { Plus, List, CheckCircle2, Circle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { List as ListType, Task } from "@shared/schema";

interface AppSidebarProps {
  selectedListId: string | null;
  onListSelect: (listId: string | null) => void;
  onAddList: () => void;
}

export function AppSidebar({ selectedListId, onListSelect, onAddList }: AppSidebarProps) {
  const { data: lists = [] } = useQuery<ListType[]>({
    queryKey: ["/api/lists"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

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
          <SidebarGroupLabel>Mis Tareas</SidebarGroupLabel>
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
          <SidebarGroupLabel>Listas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lists.map((list) => (
                <SidebarMenuItem key={list.id}>
                  <SidebarMenuButton
                    onClick={() => onListSelect(list.id)}
                    isActive={selectedListId === list.id}
                    aria-current={selectedListId === list.id ? "page" : undefined}
                    data-testid={`button-list-${list.id}`}
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
