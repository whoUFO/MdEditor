import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../../renderer/stores/editorStore';
import { useFileStore } from '../../renderer/stores/fileStore';

describe('Editor Store', () => {
  beforeEach(() => {
    useEditorStore.setState({
      content: '',
      cursorPosition: { line: 1, column: 1 },
      selection: null,
      isDirty: false,
    });
  });

  it('should set content', () => {
    useEditorStore.getState().setContent('test content');
    expect(useEditorStore.getState().content).toBe('test content');
  });

  it('should mark as dirty when content changes', () => {
    useEditorStore.getState().setContent('new content');
    expect(useEditorStore.getState().isDirty).toBe(true);
  });

  it('should update cursor position', () => {
    useEditorStore.getState().setCursorPosition({ line: 5, column: 10 });
    expect(useEditorStore.getState().cursorPosition).toEqual({ line: 5, column: 10 });
  });
});

describe('File Store', () => {
  beforeEach(() => {
    useFileStore.setState({
      currentFile: null,
      fileTree: [],
      recentFiles: [],
      isLoading: false,
      error: null,
    });
  });

  it('should set current file', () => {
    const file = { 
      path: '/test.md', 
      name: 'test.md', 
      content: 'test',
      encoding: 'utf-8'
    };
    useFileStore.getState().setCurrentFile(file);
    expect(useFileStore.getState().currentFile).toEqual(file);
  });

  it('should add to recent files', () => {
    const file = { path: '/test.md', name: 'test.md' };
    useFileStore.getState().addRecentFile(file);
    expect(useFileStore.getState().recentFiles.some(f => f.path === '/test.md')).toBe(true);
  });

  it('should limit recent files to 10', () => {
    for (let i = 0; i < 15; i++) {
      useFileStore.getState().addRecentFile({ path: `/file${i}.md`, name: `file${i}.md` });
    }
    expect(useFileStore.getState().recentFiles.length).toBe(10);
  });
});
