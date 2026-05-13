import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileTree } from '../../renderer/components/file-tree/FileTree';
import { useFileStore } from '../../renderer/stores/fileStore';

vi.mock('../../renderer/stores/fileStore', () => ({
  useFileStore: vi.fn(),
}));

describe('FileTree Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useFileStore as any).mockReturnValue({
      fileTree: [
        {
          name: 'documents',
          path: '/documents',
          type: 'directory',
          children: [
            { name: 'readme.md', path: '/documents/readme.md', type: 'file' },
            { name: 'notes.md', path: '/documents/notes.md', type: 'file' },
          ],
        },
        { name: 'test.md', path: '/test.md', type: 'file' },
      ],
      loadDirectory: vi.fn(),
      openFile: vi.fn(),
      expandedDirs: new Set(),
      toggleDirectory: vi.fn(),
    });
  });

  it('should render file tree container', () => {
    render(<FileTree />);
    expect(screen.getByTestId('file-tree')).toBeInTheDocument();
  });

  it('should display root level items', () => {
    render(<FileTree />);
    
    expect(screen.getByText('documents')).toBeInTheDocument();
    expect(screen.getByText('test.md')).toBeInTheDocument();
  });

  it('should expand directory on click', async () => {
    const toggleDirectory = vi.fn();
    (useFileStore as any).mockReturnValue({
      fileTree: [
        { name: 'documents', path: '/documents', type: 'directory', children: [] },
      ],
      loadDirectory: vi.fn(),
      openFile: vi.fn(),
      expandedDirs: new Set(),
      toggleDirectory,
    });

    render(<FileTree />);
    
    const directory = screen.getByText('documents');
    fireEvent.click(directory);
    
    expect(toggleDirectory).toHaveBeenCalledWith('/documents');
  });

  it('should open file on click', () => {
    const openFile = vi.fn();
    (useFileStore as any).mockReturnValue({
      fileTree: [
        { name: 'test.md', path: '/test.md', type: 'file' },
      ],
      loadDirectory: vi.fn(),
      openFile,
      expandedDirs: new Set(),
      toggleDirectory: vi.fn(),
    });

    render(<FileTree />);
    
    const file = screen.getByText('test.md');
    fireEvent.click(file);
    
    expect(openFile).toHaveBeenCalledWith('/test.md');
  });

  it('should show directory icon', () => {
    render(<FileTree />);
    
    const directory = screen.queryByTestId('folder-icon');
    expect(directory || document.querySelector('.folder-icon')).toBeTruthy();
  });

  it('should show file icon', () => {
    render(<FileTree />);
    
    const file = document.querySelector('.file-tree-item.file');
    expect(file).toBeTruthy();
  });
});
