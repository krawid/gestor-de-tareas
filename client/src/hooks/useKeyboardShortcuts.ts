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
      // NEVER handle ANY shortcuts when in text input/textarea
      // This is critical for screen reader support (NVDA/VoiceOver)
      const activeElement = document.activeElement as HTMLElement;
      
      if (activeElement) {
        const tagName = activeElement.tagName;
        const isInputOrTextarea = tagName === 'INPUT' || tagName === 'TEXTAREA';
        const isContentEditable = activeElement.isContentEditable || 
                                   activeElement.getAttribute('contenteditable') === 'true' ||
                                   activeElement.getAttribute('role') === 'textbox';
        
        // Exit immediately if we're in any editable field
        if (isInputOrTextarea || isContentEditable) {
          return;
        }
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
