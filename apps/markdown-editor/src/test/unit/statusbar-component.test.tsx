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
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: 'Test content',
      isDirty: false,
    });
    (useFileStore as unknown as Mock).mockReturnValue({
      currentFile: null,
    });
  });

  it('should render status bar container', () => {
    render(<StatusBar />);
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
  });

  it('should display file name or untitled', () => {
    render(<StatusBar />);
    expect(screen.getByText('未命名')).toBeInTheDocument();
  });

  it('should display word count', () => {
    render(<StatusBar />);
    expect(screen.getByText(/字/)).toBeInTheDocument();
  });

  it('should display line count', () => {
    render(<StatusBar />);
    expect(screen.getByText(/行/)).toBeInTheDocument();
  });

  it('should show filename when file is open', () => {
    (useFileStore as unknown as Mock).mockReturnValue({
      currentFile: {
        name: 'test.md',
        path: '/path/to/test.md',
        encoding: 'UTF-8',
      },
    });

    render(<StatusBar />);
    expect(screen.getByText('test.md')).toBeInTheDocument();
  });

  it('should show dirty indicator when content is dirty', () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: 'Modified content',
      isDirty: true,
    });

    render(<StatusBar />);
    expect(document.querySelector('.dirty-indicator')).toBeInTheDocument();
  });

  it('should display theme', () => {
    render(<StatusBar />);
    expect(screen.getByText(/明亮|暗黑/)).toBeInTheDocument();
  });

  it('should display version', () => {
    render(<StatusBar />);
    expect(screen.getByText('v0.1.0')).toBeInTheDocument();
  });

  it('should display encoding', () => {
    render(<StatusBar />);
    expect(screen.getByText('UTF-8')).toBeInTheDocument();
  });
});