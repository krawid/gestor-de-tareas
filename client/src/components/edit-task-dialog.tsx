import { useEffect, useState } from "react";
import { NativeDialog, NativeDialogFooter } from "@/components/ui/native-dialog";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/date-time-picker";
import type { Task, List } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, data: Partial<Task>) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const { data: lists = [] } = useQuery<List[]>({
    queryKey: ["/api/lists"],
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [listId, setListId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setListId(task.listId);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task || !title.trim()) {
      return;
    }

    onSave(task.id, {
      title: title.trim(),
      description: description.trim() || "",
      priority,
      listId,
      dueDate,
    });
    
    onOpenChange(false);
  };

  return (
    <NativeDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar tarea"
      data-testid="dialog-edit-task"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium leading-none">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            data-testid="input-edit-title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium leading-none">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none mt-2"
            data-testid="input-edit-description"
          />
        </div>

        <div>
          <label htmlFor="priority" className="text-sm font-medium leading-none">
            Prioridad
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
            data-testid="select-priority"
          >
            <option value="0">Ninguna</option>
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </select>
        </div>

        <div>
          <label htmlFor="list" className="text-sm font-medium leading-none">
            Asignar a lista
          </label>
          <select
            id="list"
            value={listId || ""}
            onChange={(e) => setListId(e.target.value || null)}
            className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
            data-testid="select-list"
          >
            <option value="">Sin lista</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        <DateTimePicker
          value={dueDate}
          onChange={setDueDate}
        />

        <NativeDialogFooter>
          <Button type="submit" data-testid="button-save-edit">
            Guardar cambios
          </Button>
        </NativeDialogFooter>
      </form>
    </NativeDialog>
  );
}
