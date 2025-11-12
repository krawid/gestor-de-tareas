import { useEffect, useRef, useId } from "react";
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
  const titleId = useId();
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const isClosingProgrammatically = useRef(false);
  const lastFocusedWithin = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      // Only notify parent if this was a user-initiated close (Escape, backdrop, button)
      if (!isClosingProgrammatically.current) {
        onOpenChange(false);
      }
      
      // Reset the flag
      isClosingProgrammatically.current = false;
      
      // Restore focus when dialog closes via any method
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    };

    // Add event listener for native close event
    dialog.addEventListener('close', handleNativeClose);

    if (open) {
      if (!dialog.open) {
        // Store the currently focused element to restore focus later
        previousActiveElement.current = document.activeElement as HTMLElement;
        
        dialog.showModal();
        
        // Focus the first input/textarea/button after dialog opens
        setTimeout(() => {
          const firstFocusable = dialog.querySelector<HTMLElement>(
            'input:not([type="hidden"]), textarea, select, button'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }, 0);
      }
    } else {
      if (dialog.open) {
        // Mark this as a programmatic close
        isClosingProgrammatically.current = true;
        dialog.close();
      }
    }

    return () => {
      dialog.removeEventListener('close', handleNativeClose);
    };
  }, [open, onOpenChange]);

  // Strict focus trap - keep focus locked inside dialog
  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const getFocusableElements = (): HTMLElement[] => {
      const elements = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"]):not(:disabled), [contenteditable]:not([contenteditable="false"])'
      );
      return Array.from(elements).filter(el => {
        // Additional check for visibility
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape to close dialog
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
        return;
      }
      
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(activeElement);

      // If active element is not in the list, trap focus
      if (currentIndex === -1) {
        e.preventDefault();
        if (e.shiftKey) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }
        return;
      }

      // If at last element going forward, wrap to first
      if (!e.shiftKey && currentIndex === focusableElements.length - 1) {
        e.preventDefault();
        firstElement.focus();
        return;
      }

      // If at first element going backward, wrap to last
      if (e.shiftKey && currentIndex === 0) {
        e.preventDefault();
        lastElement.focus();
        return;
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      
      // Track the last focused element within the dialog
      if (dialog.contains(target)) {
        lastFocusedWithin.current = target;
        return;
      }
      
      // If focus escapes to browser chrome or outside dialog, bring it back
      // Use requestAnimationFrame to defer restoration, allowing React re-renders to complete
      requestAnimationFrame(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;
        
        // Try to restore to last focused element within dialog, or fall back to first
        if (lastFocusedWithin.current && focusableElements.includes(lastFocusedWithin.current)) {
          lastFocusedWithin.current.focus();
        } else {
          focusableElements[0].focus();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
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

  // Handle close button
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/80 bg-background rounded-lg shadow-lg p-6 max-w-lg w-full border border-border"
      data-testid={testId}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="flex flex-col space-y-4">
        {title && (
          <div className="flex items-start justify-between">
            <h1 id={titleId} className="text-lg font-semibold">
              {title}
            </h1>
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
