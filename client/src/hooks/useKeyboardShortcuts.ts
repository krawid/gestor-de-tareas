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
      const target = e.target as HTMLElement;
      const isInputElement = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handlersRef.current.onFocusSearch?.();
        return;
      }

      if (isInputElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          handlersRef.current.onFocusNewTask?.();
          break;
        case 'l':
          e.preventDefault();
          handlersRef.current.onNewList?.();
          break;
        case '?':
          e.preventDefault();
          handlersRef.current.onShowHelp?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
