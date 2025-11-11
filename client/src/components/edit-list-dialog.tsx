import { useState, useEffect } from "react";
import type { InsertList, List } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    if (list) {
      setName(list.name);
      setDescription(list.description || "");
      setColor(list.color);
    }
  }, [list]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!list || !name.trim()) {
      return;
    }

    onUpdate(list.id, {
      name: name.trim(),
      description: description.trim() || "",
      color,
    });
    
    onOpenChange(false);
  };

  if (!list) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-edit-list">
        <DialogHeader>
          <DialogTitle>Editar lista</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-list-name" className="text-sm font-medium leading-none">
              Nombre de la lista
            </label>
            <input
              type="text"
              id="edit-list-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Trabajo, Personal, Compras"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
              data-testid="input-edit-list-name"
              required
            />
          </div>

          <div>
            <label id="edit-list-color-label" className="text-sm font-medium leading-none">
              Color
            </label>
            <div className="flex gap-2 flex-wrap mt-2" role="group" aria-labelledby="edit-list-color-label">
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
                  data-testid={`button-edit-color-${c.value}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="edit-list-description" className="text-sm font-medium leading-none">
              Descripción (opcional)
            </label>
            <textarea
              id="edit-list-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Puedes usar Markdown: **negrita**, *cursiva*, [enlaces](https://ejemplo.com), listas, etc."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
              data-testid="textarea-edit-list-description"
            />
          </div>

          <DialogFooter>
            <Button type="submit" data-testid="button-update-list">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
