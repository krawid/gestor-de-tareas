import { useEffect, useRef } from "react";

export type TaskFilterType = "all" | "completed" | "pending";

interface TaskFilterProps {
  value: TaskFilterType;
  onChange: (filter: TaskFilterType) => void;
}

export function TaskFilter({ value, onChange }: TaskFilterProps) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcementRef.current) {
      const messages = {
        all: "Mostrando todas las tareas",
        completed: "Mostrando tareas completadas",
        pending: "Mostrando tareas pendientes"
      };
      announcementRef.current.textContent = messages[value];
    }
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <fieldset className="flex items-center gap-1 border rounded-md p-1">
        <legend className="sr-only">Filtrar tareas por estado</legend>
        
        <label className="relative">
          <input
            type="radio"
            name="task-filter"
            value="all"
            checked={value === "all"}
            onChange={(e) => onChange(e.target.value as TaskFilterType)}
            className="sr-only peer"
            data-testid="radio-filter-all"
          />
          <span className="px-3 py-1.5 text-sm rounded cursor-pointer hover-elevate active-elevate-2 peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
            Todas
          </span>
        </label>

        <label className="relative">
          <input
            type="radio"
            name="task-filter"
            value="pending"
            checked={value === "pending"}
            onChange={(e) => onChange(e.target.value as TaskFilterType)}
            className="sr-only peer"
            data-testid="radio-filter-pending"
          />
          <span className="px-3 py-1.5 text-sm rounded cursor-pointer hover-elevate active-elevate-2 peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
            Pendientes
          </span>
        </label>

        <label className="relative">
          <input
            type="radio"
            name="task-filter"
            value="completed"
            checked={value === "completed"}
            onChange={(e) => onChange(e.target.value as TaskFilterType)}
            className="sr-only peer"
            data-testid="radio-filter-completed"
          />
          <span className="px-3 py-1.5 text-sm rounded cursor-pointer hover-elevate active-elevate-2 peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
            Completadas
          </span>
        </label>
      </fieldset>

      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        className="sr-only"
        data-testid="text-filter-announcement"
      />
    </div>
  );
}
