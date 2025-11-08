import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    {
      keys: ["N"],
      description: "Enfocar en el campo de nueva tarea",
    },
    {
      keys: ["Ctrl", "K"],
      macKeys: ["⌘", "K"],
      description: "Enfocar en el campo de búsqueda",
    },
    {
      keys: ["L"],
      description: "Crear nueva lista",
    },
    {
      keys: ["?"],
      description: "Mostrar/ocultar esta ayuda de atajos",
    },
    {
      keys: ["Esc"],
      description: "Cerrar diálogos y modales",
    },
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-keyboard-shortcuts">
        <DialogHeader>
          <DialogTitle>Atajos de teclado</DialogTitle>
          <DialogDescription>
            Utiliza estos atajos de teclado para navegar más rápido por la aplicación
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => {
              const keysToDisplay = isMac && shortcut.macKeys ? shortcut.macKeys : shortcut.keys;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0"
                  data-testid={`shortcut-item-${index}`}
                >
                  <span className="text-sm text-foreground flex-1">
                    {shortcut.description}
                  </span>
                  <div className="flex gap-1 items-center">
                    {keysToDisplay.map((key, keyIndex) => (
                      <span key={keyIndex} className="flex gap-1 items-center">
                        <Kbd>{key}</Kbd>
                        {keyIndex < keysToDisplay.length - 1 && (
                          <span className="text-muted-foreground text-xs">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Los atajos de teclado no funcionan cuando estás escribiendo en un campo de texto.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
