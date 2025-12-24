import { useState, useEffect } from "react";
import type { InsertTask, List } from "@shared/schema";
import { NativeDialog, NativeDialogFooter } from "@/components/ui/native-dialog";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";


interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: InsertTask) => void;
  lists: List[];
}

export function AddTaskDialog({ open, onOpenChange, onAdd, lists }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [listId, setListId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setPriority(0);
      setListId(null);
      setStartDate(null);
      setEndDate(null);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim() || "",
      completed: false,
      priority,
      listId,
      startDate,
      endDate,
    });
    
    onOpenChange(false);
  };

  return (
    <NativeDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Nueva tarea"
      data-testid="dialog-add-task"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="text-sm font-medium leading-none">
            Título
          </label>
          <input
            type="text"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            data-testid="input-task-title"
            required
          />
        </div>

        <div>
          <label htmlFor="task-description" className="text-sm font-medium leading-none">
            Descripción (opcional)
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade detalles adicionales..."
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none mt-2"
            rows={3}
            data-testid="input-task-description"
          />
        </div>

        <div>
          <label htmlFor="task-list" className="text-sm font-medium leading-none">
            Asignar a lista
          </label>
          <select
            id="task-list"
            value={listId || ""}
            onChange={(e) => setListId(e.target.value || null)}
            className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
            data-testid="select-task-list"
          >
            <option value="">Sin lista</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-priority" className="text-sm font-medium leading-none">
            Prioridad
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
            data-testid="select-task-priority"
          >
            <option value="0">Ninguna</option>
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </select>
        </div>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <NativeDialogFooter>
          <Button type="submit" data-testid="button-save-task">
            Crear tarea
          </Button>
        </NativeDialogFooter>
      </form>
    </NativeDialog>
  );
}
