import ReactMarkdown from "react-markdown";
import { NativeDialog } from "@/components/ui/native-dialog";
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
    <NativeDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Descripción: ${list.name}`}
      data-testid={`dialog-view-description-${list.id}`}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto">
        <ReactMarkdown>
          {list.description || "Sin descripción"}
        </ReactMarkdown>
      </div>
    </NativeDialog>
  );
}
