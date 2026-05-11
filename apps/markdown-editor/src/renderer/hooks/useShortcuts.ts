import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useFileStore } from '../stores/fileStore';
import { useUIStore } from '../stores/uiStore';

const shortcuts = [
  { key: 'ctrl+b', action: 'bold' },
  { key: 'ctrl+i', action: 'italic' },
  { key: 'ctrl+k', action: 'code' },
  { key: 'ctrl+1', action: 'h1' },
  { key: 'ctrl+2', action: 'h2' },
  { key: 'ctrl+3', action: 'h3' },
  { key: 'ctrl+s', action: 'save' },
  { key: 'ctrl+o', action: 'open' },
  { key: 'ctrl+shift+s', action: 'saveAs' },
  { key: 'ctrl+shift+p', action: 'togglePreview' },
  { key: 'ctrl+shift+u', action: 'list' },
  { key: 'ctrl+shift+o', action: 'orderedList' },
  { key: 'ctrl+shift+]', action: 'quote' },
  { key: 'ctrl+shift+k', action: 'codeBlock' },
];

export function useShortcuts(): void {
  const { insertText, getSelectedText } = useEditorStore();
  const { openFile, saveFile, saveAsFile } = useFileStore();
  const { togglePreview, toggleTheme } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
      const shortcut = shortcuts.find((s) => s.key === key);

      if (shortcut) {
        e.preventDefault();
        
        switch (shortcut.action) {
          case 'bold':
            insertText(`**${getSelectedText() || 'bold text'}**`);
            break;
          case 'italic':
            insertText(`*${getSelectedText() || 'italic text'}*`);
            break;
          case 'code':
            insertText(`\`${getSelectedText() || 'code'}\``);
            break;
          case 'h1':
            insertText('# ');
            break;
          case 'h2':
            insertText('## ');
            break;
          case 'h3':
            insertText('### ');
            break;
          case 'list':
            insertText('- ');
            break;
          case 'orderedList':
            insertText('1. ');
            break;
          case 'quote':
            insertText('> ');
            break;
          case 'codeBlock':
            insertText('```\n\n```');
            break;
          case 'save':
            saveFile();
            break;
          case 'open':
            openFile();
            break;
          case 'saveAs':
            saveAsFile();
            break;
          case 'togglePreview':
            togglePreview();
            break;
          case 'toggleTheme':
            toggleTheme();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insertText, getSelectedText, openFile, saveFile, saveAsFile, togglePreview, toggleTheme]);
}
