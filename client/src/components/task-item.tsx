import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  0: "transparent",
  1: "#3b82f6",
  2: "#f59e0b",
  3: "#ef4444",
};

const priorityLabels = {
  0: "Sin prioridad",
  1: "Baja",
  2: "Media",
  3: "Alta",
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <div
      className="group flex items-center gap-3 p-4 bg-card border border-card-border rounded-md hover-elevate transition-all"
      style={{
        borderLeftWidth: task.priority > 0 ? "4px" : "1px",
        borderLeftColor: priorityColors[task.priority as keyof typeof priorityColors],
      }}
      data-testid={`task-item-${task.id}`}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
        className="h-5 w-5"
        data-testid={`checkbox-task-${task.id}`}
      />
      
      <label
        htmlFor={`task-${task.id}`}
        className="flex-1 cursor-pointer"
      >
        <span
          className={`text-base ${
            task.completed
              ? "line-through opacity-60"
              : ""
          }`}
          data-testid={`text-task-title-${task.id}`}
        >
          {task.title}
        </span>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-task-description-${task.id}`}>
            {task.description}
          </p>
        )}
        {task.priority > 0 && (
          <span className="sr-only">
            Prioridad: {priorityLabels[task.priority as keyof typeof priorityLabels]}
          </span>
        )}
      </label>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(task)}
          aria-label={`Editar tarea: ${task.title}`}
          data-testid={`button-edit-${task.id}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(task.id)}
          aria-label={`Eliminar tarea: ${task.title}`}
          data-testid={`button-delete-${task.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
