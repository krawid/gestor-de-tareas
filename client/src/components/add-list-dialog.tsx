import { useForm, Controller } from "react-hook-form";
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
import { NativeInput } from "@/components/ui/native-input";
import { NativeTextarea } from "@/components/ui/native-textarea";
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
      description: "",
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

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label htmlFor="list-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nombre de la lista
            </label>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <NativeInput
                    id="list-name"
                    {...field}
                    placeholder="Ej: Trabajo, Personal, Compras"
                    className="text-base mt-2"
                    data-testid="input-list-name"
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
            <label id="list-color-label" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Color
            </label>
            <Controller
              control={form.control}
              name="color"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex gap-2 flex-wrap mt-2" role="group" aria-labelledby="list-color-label">
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
            <label htmlFor="list-description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Descripción (opcional)
            </label>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <>
                  <NativeTextarea
                    id="list-description"
                    {...field}
                    placeholder="Puedes usar Markdown: **negrita**, *cursiva*, [enlaces](https://ejemplo.com), listas, etc."
                    className="text-base min-h-[100px] mt-2"
                    data-testid="textarea-list-description"
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

          <DialogFooter>
            <Button type="submit" data-testid="button-save-list">
              Crear lista
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
