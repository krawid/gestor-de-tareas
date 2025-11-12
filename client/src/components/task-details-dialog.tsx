import ReactMarkdown from "react-markdown";
import { NativeDialog, NativeDialogContent } from "@/components/ui/native-dialog";
import type { Task } from "@shared/schema";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export function TaskDetailsDialog({ open, onOpenChange, task }: TaskDetailsDialogProps) {
  return (
    <NativeDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title={task.title}
      data-testid={`dialog-task-details-${task.id}`}
    >
      <NativeDialogContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Descripción
            </h2>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none" 
              data-testid={`text-task-description-detail-${task.id}`}
            >
              <ReactMarkdown>
                {task.description || "Sin descripción"}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </NativeDialogContent>
    </NativeDialog>
  );
}
