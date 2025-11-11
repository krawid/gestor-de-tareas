import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { List } from "@shared/schema";

interface ViewListDescriptionDialogProps {
  list: List | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewListDescriptionDialog({
  list,
  open,
  onOpenChange,
}: ViewListDescriptionDialogProps) {
  if (!list) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid={`dialog-view-description-${list.id}`}
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Descripción: {list.name}</DialogTitle>
        </DialogHeader>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {list.description || "Sin descripción"}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}
