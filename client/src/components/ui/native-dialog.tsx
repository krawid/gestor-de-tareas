import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface NativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  "data-testid"?: string;
}

export function NativeDialog({ open, onOpenChange, children, title, "data-testid": testId }: NativeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );

    if (!isInDialog) {
      onOpenChange(false);
    }
  };

  // Handle close button and escape key
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={handleClose}
      className="backdrop:bg-black/80 bg-background rounded-lg shadow-lg p-6 max-w-lg w-full border border-border"
      data-testid={testId}
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div className="flex flex-col space-y-4">
        {title && (
          <div className="flex items-start justify-between">
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Cerrar"
              data-testid="button-close-dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}

interface NativeDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function NativeDialogContent({ children, className = "" }: NativeDialogContentProps) {
  return <div className={className}>{children}</div>;
}

interface NativeDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function NativeDialogFooter({ children, className = "" }: NativeDialogFooterProps) {
  return (
    <div className={`flex justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
