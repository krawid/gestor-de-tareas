import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NativeInput } from "@/components/ui/native-input";
import { NativeTextarea } from "@/components/ui/native-textarea";
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

const editTaskSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  priority: z.number().min(0).max(3),
  listId: z.string().nullable(),
  dueDate: z.date().nullable(),
});

type EditTaskForm = z.infer<typeof editTaskSchema>;

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const { data: lists = [] } = useQuery<List[]>({
    queryKey: ["/api/lists"],
  });

  const form = useForm<EditTaskForm>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 0,
      listId: null,
      dueDate: null,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        listId: task.listId,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    }
  }, [task, form]);

  const handleSubmit = (data: EditTaskForm) => {
    if (task) {
      onSave(task.id, data);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-edit-task">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Título
            </label>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <>
                  <NativeInput
                    id="title"
                    {...field}
                    className="text-base mt-2"
                    data-testid="input-edit-title"
                    required
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Descripción
            </label>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <>
                  <NativeTextarea
                    id="description"
                    {...field}
                    rows={3}
                    className="resize-none text-base mt-2"
                    data-testid="input-edit-description"
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="priority" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Prioridad
            </label>
            <Controller
              control={form.control}
              name="priority"
              render={({ field, fieldState }) => (
                <>
                  <select
                    id="priority"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
                    data-testid="select-priority"
                    aria-invalid={fieldState.error ? "true" : "false"}
                  >
                    <option value="0">Ninguna</option>
                    <option value="1">Baja</option>
                    <option value="2">Media</option>
                    <option value="3">Alta</option>
                  </select>
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="list" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Asignar a lista
            </label>
            <Controller
              control={form.control}
              name="listId"
              render={({ field, fieldState }) => (
                <>
                  <select
                    id="list"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
                    data-testid="select-list"
                    aria-invalid={fieldState.error ? "true" : "false"}
                  >
                    <option value="">Sin lista</option>
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="dueDate"
            render={({ field, fieldState }) => (
              <>
                <DateTimePicker
                  value={field.value || null}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />

          <DialogFooter>
            <Button type="submit" data-testid="button-save-edit">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
