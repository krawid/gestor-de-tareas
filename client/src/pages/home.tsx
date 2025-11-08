import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AddTaskInput, type AddTaskInputRef } from "@/components/add-task-input";
import { TaskList } from "@/components/task-list";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { AddListDialog } from "@/components/add-list-dialog";
import { useToast } from "@/hooks/use-toast";
import type { TaskFilterType } from "@/components/task-filter";
import type { Task, InsertTask, InsertList } from "@shared/schema";

interface HomeProps {
  selectedListId: string | null;
  searchQuery: string;
  taskFilter: TaskFilterType;
  onAddListClick: () => void;
  isAddListOpen: boolean;
  onAddListOpenChange: (open: boolean) => void;
}

export interface HomeRef {
  focusAddTask: () => void;
}

const Home = forwardRef<HomeRef, HomeProps>(
  ({ selectedListId, searchQuery, taskFilter, onAddListClick, isAddListOpen, onAddListOpenChange }, ref) => {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { toast } = useToast();
    const addTaskInputRef = useRef<AddTaskInputRef>(null);

    useImperativeHandle(ref, () => ({
      focusAddTask: () => {
        addTaskInputRef.current?.focus();
      },
    }));

    const { data: allTasks = [], isLoading } = useQuery<Task[]>({
      queryKey: ["/api/tasks"],
    });

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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
        toast({
          title: "Tarea actualizada",
          description: "Los cambios se han guardado correctamente",
        });
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

    const handleAddTask = (title: string, dueDate: Date | null) => {
      createTaskMutation.mutate({
        title,
        description: null,
        completed: false,
        priority: 0,
        listId: selectedListId,
        dueDate: dueDate,
      });
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
      if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        deleteTaskMutation.mutate(id);
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

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold mb-6" data-testid="text-page-title">
                {selectedListId === null ? "Todas las tareas" : "Tareas"}
              </h1>
              <AddTaskInput
                ref={addTaskInputRef}
                onAdd={handleAddTask}
                listId={selectedListId}
                autoFocus={true}
              />
            </div>

            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>

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
      </div>
    );
  }
);

Home.displayName = "Home";

export default Home;
