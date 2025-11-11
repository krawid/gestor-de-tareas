import { useEffect, useRef } from 'react';

export interface KeyboardShortcutHandlers {
  onFocusSearch?: () => void;
  onFocusNewTask?: () => void;
  onNewList?: () => void;
  onShowHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handlersRef = useRef(handlers);
  
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Helper function to check if an element is editable
      const isEditable = (el: Element | null): boolean => {
        if (!el) return false;
        const tagName = el.tagName;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
          return true;
        }
        const htmlEl = el as HTMLElement;
        if (htmlEl.isContentEditable) return true;
        if (htmlEl.getAttribute('contenteditable') === 'true') return true;
        if (htmlEl.getAttribute('role') === 'textbox') return true;
        return false;
      };

      // Check BOTH event.target AND document.activeElement
      // Screen readers may send events differently
      const target = e.target as Element;
      const activeElement = document.activeElement;

      if (isEditable(target) || isEditable(activeElement)) {
        // NEVER intercept ANY keys when in editable fields
        // This is CRITICAL for screen reader character navigation
        return;
      }

      // Only handle shortcuts when NOT in editable elements
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handlersRef.current.onFocusSearch?.();
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'n' || key === 'l' || key === '?') {
        e.preventDefault();
        
        switch (key) {
          case 'n':
            handlersRef.current.onFocusNewTask?.();
            break;
          case 'l':
            handlersRef.current.onNewList?.();
            break;
          case '?':
            handlersRef.current.onShowHelp?.();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
