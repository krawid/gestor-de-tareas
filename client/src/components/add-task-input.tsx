import { useState, useRef, useEffect, KeyboardEvent, forwardRef, useImperativeHandle } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTaskInputProps {
  onAdd: (title: string, dueDate: Date | null) => void;
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
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus, listId]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (title.trim()) {
        const dateValue = dueDate ? new Date(dueDate + 'T12:00:00') : null;
        onAdd(title.trim(), dateValue);
        setTitle("");
        setDueDate("");
        inputRef.current?.focus();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setTitle("");
        e.currentTarget.blur();
      }
    };

    const handleClearDate = () => {
      setDueDate("");
    };

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
        <div className="flex gap-2 items-center">
          <label htmlFor="add-task-due-date" className="text-sm text-muted-foreground">
            Fecha de vencimiento:
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
      </form>
    );
  }
);

AddTaskInput.displayName = "AddTaskInput";
