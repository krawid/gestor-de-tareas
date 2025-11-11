import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import type { InsertTask, List } from "@shared/schema";
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


interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: InsertTask) => void;
  lists: List[];
}

export function AddTaskDialog({ open, onOpenChange, onAdd, lists }: AddTaskDialogProps) {
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
      priority: 0,
      listId: null,
      dueDate: null,
    },
  });

  const handleSubmit = (data: InsertTask) => {
    onAdd(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-task">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Título
            </label>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <>
                  <NativeInput
                    id="task-title"
                    {...field}
                    placeholder="¿Qué necesitas hacer?"
                    className="text-base mt-2"
                    data-testid="input-task-title"
                    required
                    autoFocus
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
            <label htmlFor="task-description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Descripción (opcional)
            </label>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <>
                  <NativeTextarea
                    id="task-description"
                    {...field}
                    value={field.value || ""}
                    placeholder="Añade detalles adicionales..."
                    className="text-base resize-none mt-2"
                    rows={3}
                    data-testid="input-task-description"
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
            <label htmlFor="task-list" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Asignar a lista
            </label>
            <Controller
              control={form.control}
              name="listId"
              render={({ field, fieldState }) => (
                <>
                  <select
                    id="task-list"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
                    data-testid="select-task-list"
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

          <div>
            <label htmlFor="task-priority" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Prioridad
            </label>
            <Controller
              control={form.control}
              name="priority"
              render={({ field, fieldState }) => (
                <>
                  <select
                    id="task-priority"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full text-base border border-input rounded-md px-3 py-2 bg-background mt-2"
                    data-testid="select-task-priority"
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
            <Button type="submit" data-testid="button-save-task">
              Crear tarea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
