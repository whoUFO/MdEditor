import { create } from 'zustand';
import type { EditorState } from '@shared/types';

interface EditorStore extends EditorState {
  setContent: (content: string) => void;
  loadContent: (content: string) => void;
  setCursorPosition: (pos: { line: number; column: number }) => void;
  setSelection: (selection: { from: number; to: number } | null) => void;
  markDirty: (dirty: boolean) => void;
  insertText: (text: string, at?: number) => void;
  getSelectedText: () => string;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  content: '',
  cursorPosition: { line: 1, column: 1 },
  selection: null,
  isDirty: false,

  setContent: (content) => {
    const current = get().content;
    if (content !== current) {
      set({ content, isDirty: true });
    }
  },

  loadContent: (content) => {
    const current = get().content;
    if (content !== current) {
      set({ content, isDirty: false });
    }
  },

  setCursorPosition: (pos) => {
    set({ cursorPosition: pos });
  },

  setSelection: (selection) => {
    set({ selection });
  },

  markDirty: (dirty) => {
    set({ isDirty: dirty });
  },

  insertText: (text, at) => {
    const { content, selection } = get();
    let newContent: string;
    
    if (selection && selection.from !== selection.to) {
      newContent = content.slice(0, selection.from) + text + content.slice(selection.to);
    } else if (at !== undefined) {
      newContent = content.slice(0, at) + text + content.slice(at);
    } else {
      newContent = content + text;
    }
    
    set({ content: newContent, isDirty: true });
  },

  getSelectedText: () => {
    const { content, selection } = get();
    if (selection && selection.from !== selection.to) {
      return content.slice(selection.from, selection.to);
    }
    return '';
  },
}));