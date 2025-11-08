import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTaskInputProps {
  onAdd: (title: string) => void;
  listId: string | null;
  autoFocus?: boolean;
}

export function AddTaskInput({ onAdd, listId, autoFocus = true }: AddTaskInputProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, listId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setTitle("");
      e.currentTarget.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-card border-2 border-input rounded-md">
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
    </form>
  );
}
