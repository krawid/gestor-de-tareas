import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { X } from "lucide-react";

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

  const dueDateValue = form.watch("dueDate");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-task">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="task-title">Título</FormLabel>
                  <FormControl>
                    <Input
                      id="task-title"
                      {...field}
                      placeholder="¿Qué necesitas hacer?"
                      className="text-base"
                      data-testid="input-task-title"
                      required
                      autoFocus
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
                  <FormLabel htmlFor="task-description">Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      id="task-description"
                      {...field}
                      value={field.value || ""}
                      placeholder="Añade detalles adicionales..."
                      className="text-base resize-none"
                      rows={3}
                      data-testid="input-task-description"
                    />
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
                  <FormLabel htmlFor="task-list">Asignar a lista</FormLabel>
                  <FormControl>
                    <select
                      id="task-list"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                      data-testid="select-task-list"
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="task-priority">Prioridad</FormLabel>
                    <FormControl>
                      <select
                        id="task-priority"
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                        data-testid="select-task-priority"
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
                name="dueDate"
                render={({ field }) => {
                  const [isInteracting, setIsInteracting] = useState(false);
                  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  const currentValue = field.value
                    ? field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : ""
                    : "";

                  return (
                    <FormItem>
                      <FormLabel htmlFor="task-due-date">Fecha de vencimiento</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            id="task-due-date"
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
                                field.onChange(value ? value : null);
                              }
                            }}
                            className="text-base"
                            data-testid="input-task-due-date"
                          />
                        </FormControl>
                        {dueDateValue && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => field.onChange(null)}
                            aria-label="Limpiar fecha de vencimiento"
                            data-testid="button-clear-due-date"
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
            </div>

            <DialogFooter>
              <Button type="submit" data-testid="button-save-task">
                Crear tarea
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
