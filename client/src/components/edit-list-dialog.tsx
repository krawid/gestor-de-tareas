import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListSchema } from "@shared/schema";
import type { InsertList, List } from "@shared/schema";
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
import { useEffect } from "react";

interface EditListDialogProps {
  list: List | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: InsertList) => void;
}

const colors = [
  { value: "#3b82f6", label: "Azul" },
  { value: "#8b5cf6", label: "Púrpura" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#f59e0b", label: "Naranja" },
  { value: "#10b981", label: "Verde" },
  { value: "#06b6d4", label: "Cian" },
];

export function EditListDialog({ list, open, onOpenChange, onUpdate }: EditListDialogProps) {
  const form = useForm<InsertList>({
    resolver: zodResolver(insertListSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6",
    },
  });

  useEffect(() => {
    if (list) {
      form.reset({
        name: list.name,
        description: list.description || "",
        color: list.color,
      });
    }
  }, [list, form]);

  const handleSubmit = (data: InsertList) => {
    if (list) {
      onUpdate(list.id, data);
      onOpenChange(false);
    }
  };

  if (!list) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-edit-list">
        <DialogHeader>
          <DialogTitle>Editar lista</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-list-name">Nombre de la lista</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-list-name"
                      {...field}
                      placeholder="Ej: Trabajo, Personal, Compras"
                      className="text-base"
                      data-testid="input-edit-list-name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-list-color">Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap" role="group" aria-labelledby="edit-color-group-label">
                      <span id="edit-color-group-label" className="sr-only">
                        Selecciona un color para la lista
                      </span>
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => field.onChange(color.value)}
                          className={`w-10 h-10 rounded-md border-2 transition-all ${
                            field.value === color.value
                              ? "border-foreground scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                          aria-label={`${color.label}${field.value === color.value ? ', seleccionado' : ''}`}
                          aria-pressed={field.value === color.value}
                          data-testid={`button-edit-color-${color.value}`}
                        />
                      ))}
                    </div>
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
                  <FormLabel htmlFor="edit-list-description">
                    Descripción (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="edit-list-description"
                      {...field}
                      placeholder="Puedes usar Markdown: **negrita**, *cursiva*, [enlaces](https://ejemplo.com), listas, etc."
                      className="text-base min-h-[100px]"
                      data-testid="textarea-edit-list-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" data-testid="button-update-list">
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
