import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function DataManagement() {
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const response = await apiRequest("GET", "/api/export", undefined);
      const data = await response.json();
      
      // Create blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tareas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Datos exportados",
        description: "El archivo se ha descargado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast({
          title: "Archivo inválido",
          description: "Por favor selecciona un archivo JSON",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No hay archivo",
        description: "Por favor selecciona un archivo para importar",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const text = await selectedFile.text();
      const data = JSON.parse(text);

      // Validate basic structure
      if (!data.lists || !data.tasks) {
        throw new Error("Formato de archivo inválido");
      }

      const response = await apiRequest("POST", "/api/import", {
        lists: data.lists,
        tasks: data.tasks,
        mode: importMode,
      });
      
      const result: any = await response.json();

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });

      toast({
        title: "Datos importados",
        description: `Se importaron ${result.imported.lists} listas y ${result.imported.tasks} tareas`,
      });

      setImportDialogOpen(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Error al importar",
        description: error instanceof Error ? error.message : "No se pudieron importar los datos",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleExport}
          variant="ghost"
          className="w-full justify-start"
        >
          Exportar datos
        </Button>
        <Button
          onClick={() => setImportDialogOpen(true)}
          variant="ghost"
          className="w-full justify-start"
        >
          Importar datos
        </Button>
      </div>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar datos</DialogTitle>
            <DialogDescription>
              Selecciona un archivo JSON con tus tareas y listas exportadas previamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">Archivo JSON</Label>
              <input
                id="file-input"
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="w-full"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Modo de importación</Label>
              <RadioGroup value={importMode} onValueChange={(value) => setImportMode(value as "merge" | "replace")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="merge" id="merge" />
                  <Label htmlFor="merge" className="font-normal cursor-pointer">
                    Añadir a los datos existentes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replace" id="replace" disabled />
                  <Label htmlFor="replace" className="font-normal cursor-not-allowed opacity-50">
                    Reemplazar todos los datos (próximamente)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">
                Los datos importados se añadirán a tus tareas y listas actuales.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
