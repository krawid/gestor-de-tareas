import { useState } from "react";
import { Pencil, Trash2, Calendar, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeCheckbox } from "@/components/ui/native-checkbox";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import type { Task } from "@shared/schema";
import { TaskDetailsDialog } from "@/components/task-details-dialog";

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
  const [showDetails, setShowDetails] = useState(false);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && !task.completed && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = dueDate && !task.completed && isToday(dueDate);

  const formatDueDate = (date: Date) => {
    const hasSpecificTime = date.getHours() !== 0 || date.getMinutes() !== 0;
    if (hasSpecificTime) {
      return format(date, "d 'de' MMMM, HH:mm", { locale: es });
    }
    return format(date, "d 'de' MMMM", { locale: es });
  };

  return (
    <div
      className="group flex items-center gap-3 p-4 bg-card border border-card-border rounded-md hover-elevate transition-all"
      style={{
        borderLeftWidth: task.priority > 0 ? "4px" : "1px",
        borderLeftColor: priorityColors[task.priority as keyof typeof priorityColors],
      }}
      data-testid={`task-item-${task.id}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <NativeCheckbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={(checked) => onToggle(task.id, checked)}
          className="h-5 w-5"
          data-testid={`checkbox-task-${task.id}`}
        />
        <label
          htmlFor={`task-${task.id}`}
          className={`flex-1 cursor-pointer text-base ${
            task.completed
              ? "line-through opacity-60"
              : ""
          }`}
          data-testid={`text-task-title-${task.id}`}
        >
          {task.title}
        </label>
        {dueDate && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm flex items-center gap-1 ${
                isOverdue ? "text-red-600 dark:text-red-400" : isDueToday ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
              }`}
              data-testid={`text-task-due-date-${task.id}`}
            >
              {isOverdue && <AlertCircle className="h-3 w-3" />}
              <Calendar className="h-3 w-3" />
              {formatDueDate(dueDate)}
              {isOverdue && " (Vencida)"}
              {isDueToday && " (Hoy)"}
            </span>
          </div>
        )}
        {task.priority > 0 && (
          <span className="sr-only">
            Prioridad: {priorityLabels[task.priority as keyof typeof priorityLabels]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        {task.description && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowDetails(true)}
            aria-label={`Ver detalles de ${task.title}`}
            data-testid={`button-details-${task.id}`}
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
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

      {task.description && (
        <TaskDetailsDialog
          open={showDetails}
          onOpenChange={setShowDetails}
          task={task}
        />
      )}
    </div>
  );
}
