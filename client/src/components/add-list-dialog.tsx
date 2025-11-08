import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListSchema } from "@shared/schema";
import type { InsertList } from "@shared/schema";
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
import { Button } from "@/components/ui/button";

interface AddListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: InsertList) => void;
}

const colors = [
  { value: "#3b82f6", label: "Azul" },
  { value: "#8b5cf6", label: "Púrpura" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#f59e0b", label: "Naranja" },
  { value: "#10b981", label: "Verde" },
  { value: "#06b6d4", label: "Cian" },
];

export function AddListDialog({ open, onOpenChange, onAdd }: AddListDialogProps) {
  const form = useForm<InsertList>({
    resolver: zodResolver(insertListSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  });

  const handleSubmit = (data: InsertList) => {
    onAdd(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-list">
        <DialogHeader>
          <DialogTitle>Nueva lista</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="list-name">Nombre de la lista</FormLabel>
                  <FormControl>
                    <Input
                      id="list-name"
                      {...field}
                      placeholder="Ej: Trabajo, Personal, Compras"
                      className="text-base"
                      data-testid="input-list-name"
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
                  <FormLabel htmlFor="list-color">Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap" role="group" aria-labelledby="color-group-label">
                      <span id="color-group-label" className="sr-only">
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
                          data-testid={`button-color-${color.value}`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" data-testid="button-save-list">
                Crear lista
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
