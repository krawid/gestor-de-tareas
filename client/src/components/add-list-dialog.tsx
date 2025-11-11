import { useState, useEffect } from "react";
import type { InsertList } from "@shared/schema";
import { NativeDialog, NativeDialogFooter } from "@/components/ui/native-dialog";
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setColor("#3b82f6");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      description: description.trim() || "",
      color,
    });
    
    onOpenChange(false);
  };

  return (
    <NativeDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nueva lista"
      data-testid="dialog-add-list"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="list-name" className="text-sm font-medium leading-none">
            Nombre de la lista
          </label>
          <input
            type="text"
            id="list-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Trabajo, Personal, Compras"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            data-testid="input-list-name"
            required
          />
        </div>

        <div>
          <label id="list-color-label" className="text-sm font-medium leading-none">
            Color
          </label>
          <div className="flex gap-2 flex-wrap mt-2" role="group" aria-labelledby="list-color-label">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-10 h-10 rounded-md border-2 transition-all ${
                  color === c.value
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
                aria-label={`${c.label}${color === c.value ? ', seleccionado' : ''}`}
                aria-pressed={color === c.value}
                data-testid={`button-color-${c.value}`}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="list-description" className="text-sm font-medium leading-none">
            Descripción (opcional)
          </label>
          <textarea
            id="list-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Puedes usar Markdown: **negrita**, *cursiva*, [enlaces](https://ejemplo.com), listas, etc."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            data-testid="textarea-list-description"
          />
        </div>

        <NativeDialogFooter>
          <Button type="submit" data-testid="button-save-list">
            Crear lista
          </Button>
        </NativeDialogFooter>
      </form>
    </NativeDialog>
  );
}
