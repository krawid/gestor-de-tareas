import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <DialogContent data-testid="dialog-edit-task" aria-describedby="edit-task-description">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>
        <p id="edit-task-description" className="sr-only">
          Modifica los detalles de la tarea seleccionada
        </p>

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
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger id="priority" data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Sin prioridad</SelectItem>
                      <SelectItem value="1">Baja</SelectItem>
                      <SelectItem value="2">Media</SelectItem>
                      <SelectItem value="3">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="list">Lista</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger id="list" data-testid="select-list">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin lista</SelectItem>
                      {lists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dueDate">Fecha de vencimiento</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Input
                        id="dueDate"
                        type="date"
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value + 'T12:00:00') : null)}
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
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-edit"
              >
                Cancelar
              </Button>
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
