import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecentFiles } from '../../renderer/components/recent-files/RecentFiles';
import { useFileStore } from '../../renderer/stores/fileStore';

vi.mock('../../renderer/stores/fileStore', () => ({
  useFileStore: vi.fn(),
}));

describe('RecentFiles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() - 60000 },
        { path: '/path/to/file2.md', name: 'file2.md', lastOpened: Date.now() - 3600000 },
        { path: '/path/to/file3.md', name: 'file3.md', lastOpened: Date.now() - 86400000 },
      ],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });
  });

  it('should render recent files list', () => {
    render(<RecentFiles />);
    const items = document.querySelectorAll('.recent-file-item');
    expect(items.length).toBe(3);
  });

  it('should display file names', () => {
    render(<RecentFiles />);
    expect(screen.getByText('file1.md')).toBeInTheDocument();
    expect(screen.getByText('file2.md')).toBeInTheDocument();
    expect(screen.getByText('file3.md')).toBeInTheDocument();
  });

  it('should display file paths', () => {
    render(<RecentFiles />);
    const pathElements = document.querySelectorAll('.recent-file-path');
    expect(pathElements.length).toBe(3);
  });

  it('should display time ago format', () => {
    render(<RecentFiles />);
    expect(screen.getByText('1 分钟前')).toBeInTheDocument();
    expect(screen.getByText('1 小时前')).toBeInTheDocument();
    expect(screen.getByText('1 天前')).toBeInTheDocument();
  });

  it('should show empty state when no recent files', () => {
    (useFileStore as any).mockReturnValue({
      recentFiles: [],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    expect(screen.getByText('暂无最近文件')).toBeInTheDocument();
  });

  it('should show clear button when files exist', () => {
    render(<RecentFiles />);
    expect(screen.getByText('清空')).toBeInTheDocument();
  });

  it('should hide clear button when no files', () => {
    (useFileStore as any).mockReturnValue({
      recentFiles: [],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    expect(screen.queryByText('清空')).not.toBeInTheDocument();
  });

  it('should call openFile when clicking file item', () => {
    const openFile = vi.fn();
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() },
      ],
      currentFile: null,
      openFile,
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    const fileItem = screen.getByText('file1.md');
    fireEvent.click(fileItem);
    expect(openFile).toHaveBeenCalledWith('/path/to/file1.md');
  });

  it('should call removeRecentFile when clicking delete button', () => {
    const removeRecentFile = vi.fn();
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() },
      ],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile,
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    const deleteBtn = document.querySelector('.recent-file-action.danger');
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      expect(removeRecentFile).toHaveBeenCalledWith('/path/to/file1.md');
    }
  });

  it('should call clearRecentFiles when clicking clear all', () => {
    const clearRecentFiles = vi.fn();
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() },
        { path: '/path/to/file2.md', name: 'file2.md', lastOpened: Date.now() },
      ],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles,
    });

    render(<RecentFiles />);
    const clearBtn = screen.getByText('清空');
    fireEvent.click(clearBtn);
    expect(clearRecentFiles).toHaveBeenCalled();
  });

  it('should highlight active file', () => {
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() },
      ],
      currentFile: { path: '/path/to/file1.md', name: 'file1.md', content: '', encoding: 'utf-8' },
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    const activeItem = document.querySelector('.recent-file-item.active');
    expect(activeItem).toBeInTheDocument();
  });

  it('should display "刚刚" for very recent files', () => {
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() },
      ],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    expect(screen.getByText('刚刚')).toBeInTheDocument();
  });

  it('should display date for older files', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);
    
    (useFileStore as any).mockReturnValue({
      recentFiles: [
        { path: '/path/to/file1.md', name: 'file1.md', lastOpened: oldDate.getTime() },
      ],
      currentFile: null,
      openFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
    });

    render(<RecentFiles />);
    const timeElement = document.querySelector('.recent-file-time');
    expect(timeElement).toBeInTheDocument();
  });
});
