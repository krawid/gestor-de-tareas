import { useState, useImperativeHandle, forwardRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { TaskList } from "@/components/task-list";
import { TaskItem } from "@/components/task-item";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { AddListDialog } from "@/components/add-list-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TaskFilterType } from "@/components/task-filter";
import type { Task, InsertTask, InsertList, List } from "@shared/schema";

interface HomeProps {
  selectedListId: string | null;
  searchQuery: string;
  taskFilter: TaskFilterType;
  onAddListClick: () => void;
  isAddListOpen: boolean;
  onAddListOpenChange: (open: boolean) => void;
  isAddTaskOpen: boolean;
  onAddTaskOpenChange: (open: boolean) => void;
}

export interface HomeRef {
  focusAddTask: () => void;
}

const Home = forwardRef<HomeRef, HomeProps>(
  ({ selectedListId, searchQuery, taskFilter, onAddListClick, isAddListOpen, onAddListOpenChange, isAddTaskOpen, onAddTaskOpenChange }, ref) => {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    useImperativeHandle(ref, () => ({
      focusAddTask: () => {
        onAddTaskOpenChange(true);
      },
    }));

    const { data: allTasks = [], isLoading } = useQuery<Task[]>({
      queryKey: ["/api/tasks"],
    });

    const { data: lists = [] } = useQuery<List[]>({
      queryKey: ["/api/lists"],
    });

    const selectedList = lists.find(l => l.id === selectedListId);
    const pageTitle = selectedListId === null 
      ? "Mostrando todas las tareas" 
      : `Mostrando tareas de la lista ${selectedList?.name || ""}`;

    let filteredTasks = allTasks;

    if (selectedListId !== null) {
      filteredTasks = filteredTasks.filter(t => t.listId === selectedListId);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    if (taskFilter === "completed") {
      filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (taskFilter === "pending") {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    const createTaskMutation = useMutation({
      mutationFn: async (data: InsertTask) => {
        return await apiRequest("POST", "/api/tasks", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
        toast({
          title: "Tarea creada",
          description: "La tarea se ha añadido correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo crear la tarea",
          variant: "destructive",
        });
      },
    });

    const updateTaskMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
        return await apiRequest("PATCH", `/api/tasks/${id}`, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
        
        // Si se está actualizando el estado de completado, usar mensaje específico
        if (variables.data.completed !== undefined) {
          toast({
            title: variables.data.completed ? "Tarea marcada como completada" : "Tarea marcada como pendiente",
            description: variables.data.completed 
              ? "La tarea se ha completado correctamente" 
              : "La tarea se ha marcado como pendiente",
          });
        } else {
          // Para otras actualizaciones (edición de título, descripción, etc.)
          toast({
            title: "Tarea actualizada",
            description: "Los cambios se han guardado correctamente",
          });
        }
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo actualizar la tarea",
          variant: "destructive",
        });
      },
    });

    const deleteTaskMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest("DELETE", `/api/tasks/${id}`, undefined);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
        toast({
          title: "Tarea eliminada",
          description: "La tarea se ha eliminado correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo eliminar la tarea",
          variant: "destructive",
        });
      },
    });

    const createListMutation = useMutation({
      mutationFn: async (data: InsertList) => {
        return await apiRequest("POST", "/api/lists", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
        toast({
          title: "Lista creada",
          description: "La lista se ha creado correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo crear la lista",
          variant: "destructive",
        });
      },
    });

    const handleAddTask = (data: InsertTask) => {
      createTaskMutation.mutate(data);
    };

    const handleToggleTask = (id: string, completed: boolean) => {
      updateTaskMutation.mutate({ id, data: { completed } });
    };

    const handleEditTask = (task: Task) => {
      setEditingTask(task);
    };

    const handleSaveTask = (taskId: string, data: Partial<Task>) => {
      updateTaskMutation.mutate({ id: taskId, data });
    };

    const handleDeleteTask = (id: string) => {
      setTaskToDelete(id);
    };

    const confirmDeleteTask = () => {
      if (taskToDelete) {
        deleteTaskMutation.mutate(taskToDelete);
        setTaskToDelete(null);
      }
    };

    const handleAddList = (data: InsertList) => {
      createListMutation.mutate(data);
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Cargando tareas...</p>
        </div>
      );
    }

    // Vista especial: "Todas las tareas" muestra secciones separadas
    const showSeparatedSections = selectedListId === null && taskFilter === "all";
    const pendingTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    // Determinar el título contextual para vistas filtradas
    let contextTitle = "";
    if (!showSeparatedSections) {
      if (selectedListId !== null) {
        contextTitle = `Tareas de la lista ${selectedList?.name || ""}`;
      } else if (taskFilter === "pending") {
        contextTitle = "Tareas pendientes";
      } else if (taskFilter === "completed") {
        contextTitle = "Tareas completadas";
      }
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              {!showSeparatedSections && contextTitle && (
                <h2 className="text-xl font-semibold" data-testid="text-context-title">
                  {contextTitle}
                </h2>
              )}
              <Button
                onClick={() => onAddTaskOpenChange(true)}
                data-testid="button-add-task"
                className={showSeparatedSections ? "ml-auto" : ""}
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir tarea
              </Button>
            </div>

            {showSeparatedSections ? (
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4" data-testid="heading-pending-tasks">
                    Tareas pendientes
                  </h2>
                  {pendingTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay tareas pendientes</p>
                  ) : (
                    <ul className="space-y-2" data-testid="list-pending-tasks">
                      {pendingTasks.map((task) => (
                        <li key={task.id}>
                          <TaskItem
                            task={task}
                            onToggle={handleToggleTask}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4" data-testid="heading-completed-tasks">
                    Tareas completadas
                  </h2>
                  {completedTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay tareas completadas</p>
                  ) : (
                    <ul className="space-y-2" data-testid="list-completed-tasks">
                      {completedTasks.map((task) => (
                        <li key={task.id}>
                          <TaskItem
                            task={task}
                            onToggle={handleToggleTask}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        </div>

        <AddTaskDialog
          open={isAddTaskOpen}
          onOpenChange={onAddTaskOpenChange}
          onAdd={handleAddTask}
          lists={lists}
        />

        <EditTaskDialog
          task={editingTask}
          open={editingTask !== null}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onSave={handleSaveTask}
        />

        <AddListDialog
          open={isAddListOpen}
          onOpenChange={onAddListOpenChange}
          onAdd={handleAddList}
        />

        <AlertDialog open={taskToDelete !== null} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <AlertDialogContent data-testid="alert-delete-task">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La tarea será eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteTask}
                data-testid="button-confirm-delete"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);

Home.displayName = "Home";

export default Home;
