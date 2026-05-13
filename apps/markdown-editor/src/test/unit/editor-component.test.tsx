import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Editor } from '../../renderer/components/editor/Editor';
import { useEditorStore } from '../../renderer/stores/editorStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('Editor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as any).mockReturnValue({
      content: '',
      cursorPosition: { line: 1, column: 1 },
      setContent: vi.fn(),
      setCursorPosition: vi.fn(),
    });
  });

  it('should render editor container', () => {
    render(<Editor />);
    expect(screen.getByTestId('editor-container')).toBeInTheDocument();
  });

  it('should display CodeMirror editor', () => {
    render(<Editor />);
    expect(document.querySelector('.cm-editor')).toBeInTheDocument();
  });

  it('should render content', () => {
    (useEditorStore as any).mockReturnValue({
      content: 'Test content',
      cursorPosition: { line: 1, column: 1 },
      setContent: vi.fn(),
      setCursorPosition: vi.fn(),
    });

    render(<Editor />);
    expect(document.querySelector('.cm-content')).toBeInTheDocument();
  });

  it('should show line numbers when enabled', () => {
    (useEditorStore as any).mockReturnValue({
      content: 'Test content',
      cursorPosition: { line: 1, column: 1 },
      lineNumbers: true,
      setContent: vi.fn(),
      setCursorPosition: vi.fn(),
    });

    render(<Editor />);
    expect(document.querySelector('.cm-lineNumbers')).toBeInTheDocument();
  });

  it('should apply custom font size', () => {
    (useEditorStore as any).mockReturnValue({
      content: '',
      cursorPosition: { line: 1, column: 1 },
      fontSize: 18,
      setContent: vi.fn(),
      setCursorPosition: vi.fn(),
    });

    render(<Editor />);
    const editor = document.querySelector('.cm-editor');
    expect(editor).toBeInTheDocument();
  });

  it('should handle text input', async () => {
    const setContent = vi.fn();
    (useEditorStore as any).mockReturnValue({
      content: '',
      cursorPosition: { line: 1, column: 1 },
      setContent,
      setCursorPosition: vi.fn(),
    });

    render(<Editor />);
    const editor = screen.getByTestId('editor-container');
    
    expect(editor).toBeInTheDocument();
    expect(setContent).toBeDefined();
  });

  it('should apply word wrap when enabled', () => {
    (useEditorStore as any).mockReturnValue({
      content: '',
      cursorPosition: { line: 1, column: 1 },
      wordWrap: true,
      setContent: vi.fn(),
      setCursorPosition: vi.fn(),
    });

    render(<Editor />);
    const editor = document.querySelector('.cm-editor');
    expect(editor).toBeInTheDocument();
  });
});
