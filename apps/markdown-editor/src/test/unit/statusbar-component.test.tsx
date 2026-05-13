import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '../../renderer/components/layout/StatusBar';
import { useEditorStore } from '../../renderer/stores/editorStore';
import { useFileStore } from '../../renderer/stores/fileStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

vi.mock('../../renderer/stores/fileStore', () => ({
  useFileStore: vi.fn(),
}));

describe('StatusBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as any).mockReturnValue({
      content: 'Test content',
      cursorPosition: { line: 1, column: 1 },
      wordCount: 2,
    });
    (useFileStore as any).mockReturnValue({
      currentFile: null,
    });
  });

  it('should render status bar container', () => {
    render(<StatusBar />);
    expect(document.querySelector('.status-bar')).toBeInTheDocument();
  });

  it('should display line number', () => {
    render(<StatusBar />);
    expect(document.querySelector('.line-count')).toBeInTheDocument();
  });

  it('should display column number', () => {
    render(<StatusBar />);
    expect(document.querySelector('.line-count')).toBeInTheDocument();
  });

  it('should display word count', () => {
    render(<StatusBar />);
    expect(document.querySelector('.word-count')).toBeInTheDocument();
  });

  it('should show filename when file is open', () => {
    (useFileStore as any).mockReturnValue({
      currentFile: {
        name: 'test.md',
        path: '/path/to/test.md',
      },
    });

    render(<StatusBar />);
    expect(document.querySelector('.file-name')?.textContent).toContain('test.md');
  });

  it('should show "未命名" when no file is open', () => {
    (useFileStore as any).mockReturnValue({
      currentFile: null,
    });

    render(<StatusBar />);
    expect(document.querySelector('.file-name')?.textContent).toContain('未命名');
  });

  it('should update when cursor position changes', () => {
    (useEditorStore as any).mockReturnValue({
      content: 'Test content',
      cursorPosition: { line: 5, column: 10 },
      wordCount: 2,
    });

    render(<StatusBar />);
    expect(document.querySelector('.line-count')).toBeInTheDocument();
  });
});
