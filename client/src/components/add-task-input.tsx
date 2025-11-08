import { useState, useRef, useEffect, KeyboardEvent, forwardRef, useImperativeHandle } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTaskInputProps {
  onAdd: (title: string, dueDate: Date | null, priority: number) => void;
  listId: string | null;
  autoFocus?: boolean;
}

export interface AddTaskInputRef {
  focus: () => void;
}

export const AddTaskInput = forwardRef<AddTaskInputRef, AddTaskInputProps>(
  ({ onAdd, listId, autoFocus = true }, ref) => {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        setIsExpanded(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      },
    }));

    useEffect(() => {
      if (isExpanded && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isExpanded, listId]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (title.trim()) {
        const dateValue = dueDate ? new Date(dueDate + 'T12:00:00') : null;
        onAdd(title.trim(), dateValue, priority);
        setTitle("");
        setDueDate("");
        setPriority(0);
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setTitle("");
        setDueDate("");
        setPriority(0);
        setIsExpanded(false);
      }
    };

    const handleClearDate = () => {
      setDueDate("");
    };

    const handleExpand = () => {
      setIsExpanded(true);
    };

    if (!isExpanded) {
      return (
        <Button
          onClick={handleExpand}
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          data-testid="button-show-add-task"
        >
          <Plus className="h-4 w-4" />
          Añadir tarea
        </Button>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-card border-2 border-input rounded-md">
        <div className="flex gap-2">
          <label htmlFor="add-task-input" className="sr-only">
            Nueva tarea
          </label>
          <Input
            id="add-task-input"
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Añadir tarea..."
            className="flex-1 border-0 focus-visible:ring-0 shadow-none text-base"
            data-testid="input-add-task"
          />
          <Button
            type="submit"
            disabled={!title.trim()}
            data-testid="button-submit-task"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center flex-1">
            <label htmlFor="add-task-due-date" className="text-sm text-muted-foreground whitespace-nowrap">
              Fecha:
            </label>
            <Input
              id="add-task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 shadow-none text-sm"
              data-testid="input-add-due-date"
            />
            {dueDate && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleClearDate}
                aria-label="Limpiar fecha de vencimiento"
                data-testid="button-clear-due-date"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="add-task-priority" className="text-sm text-muted-foreground whitespace-nowrap">
              Prioridad:
            </label>
            <select
              id="add-task-priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="text-sm border border-input rounded-md px-2 py-1 bg-background"
              data-testid="select-add-priority"
            >
              <option value="0">Ninguna</option>
              <option value="1">Baja</option>
              <option value="2">Media</option>
              <option value="3">Alta</option>
            </select>
          </div>
        </div>
      </form>
    );
  }
);

AddTaskInput.displayName = "AddTaskInput";
