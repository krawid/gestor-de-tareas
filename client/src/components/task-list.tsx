import { TaskItem } from "./task-item";
import type { Task } from "@shared/schema";
import { CheckCircle2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
        <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-lg font-medium text-foreground mb-2">
          No hay tareas
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Añade tu primera tarea usando el campo de entrada de arriba
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <section>
          <ul className="space-y-2" data-testid="list-active-tasks">
            {activeTasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">
            Completadas ({completedTasks.length})
          </h2>
          <ul className="space-y-2" data-testid="list-completed-tasks">
            {completedTasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
