import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  reminderMinutes: z.number().nullable(),
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
      reminderMinutes: null,
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
        reminderMinutes: task.reminderMinutes,
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Título</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      {...field}
                      className="text-base"
                      data-testid="input-edit-title"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      {...field}
                      rows={3}
                      className="resize-none text-base"
                      data-testid="input-edit-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="priority">Prioridad</FormLabel>
                  <FormControl>
                    <select
                      id="priority"
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                      data-testid="select-priority"
                    >
                      <option value="0">Ninguna</option>
                      <option value="1">Baja</option>
                      <option value="2">Media</option>
                      <option value="3">Alta</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="list">Asignar a lista</FormLabel>
                  <FormControl>
                    <select
                      id="list"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                      data-testid="select-list"
                    >
                      <option value="">Sin lista</option>
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => {
                const [isInteracting, setIsInteracting] = useState(false);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const currentValue = field.value ? new Date(field.value).toISOString().split('T')[0] : "";

                return (
                  <FormItem>
                    <FormLabel htmlFor="dueDate">Fecha de vencimiento</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input
                          id="dueDate"
                          type="date"
                          value={currentValue}
                          readOnly={isIOS && !isInteracting}
                          onChange={() => {}}
                          onClick={() => isIOS && setIsInteracting(true)}
                          onBlur={(e) => {
                            if (isIOS) setIsInteracting(false);
                            const value = e.target.value;
                            // Solo actualizar si el valor realmente cambió
                            if (value !== currentValue) {
                              field.onChange(value ? new Date(value + 'T12:00:00') : null);
                            }
                          }}
                          className="text-base"
                          data-testid="input-edit-due-date"
                        />
                      </FormControl>
                      {field.value && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => field.onChange(null)}
                          aria-label="Limpiar fecha de vencimiento"
                          data-testid="button-clear-edit-due-date"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="reminderMinutes"
              render={({ field }) => {
                const dueDateValue = form.watch("dueDate");
                return (
                  <FormItem>
                    <FormLabel htmlFor="edit-reminder">Recordatorio</FormLabel>
                    <FormControl>
                      <select
                        id="edit-reminder"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                        data-testid="select-edit-reminder"
                        disabled={!dueDateValue}
                      >
                        <option value="">Sin recordatorio</option>
                        <option value="15">15 minutos antes</option>
                        <option value="30">30 minutos antes</option>
                        <option value="60">1 hora antes</option>
                        <option value="180">3 horas antes</option>
                        <option value="360">6 horas antes</option>
                        <option value="720">12 horas antes</option>
                        <option value="1440">24 horas antes</option>
                      </select>
                    </FormControl>
                    {!dueDateValue && (
                      <p className="text-sm text-muted-foreground">
                        Establece una fecha de vencimiento para activar recordatorios
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button type="submit" data-testid="button-save-edit">
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
