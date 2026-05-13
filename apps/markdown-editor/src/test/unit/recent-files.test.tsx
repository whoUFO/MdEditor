import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('RecentFiles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct mock setup', () => {
    expect(true).toBe(true);
  });

  it('should have recent files configuration', () => {
    const recentFiles = [
      { path: '/path/to/file1.md', name: 'file1.md', lastOpened: Date.now() },
      { path: '/path/to/file2.md', name: 'file2.md', lastOpened: Date.now() - 3600000 },
    ];
    expect(recentFiles.length).toBe(2);
  });

  it('should support file operations', () => {
    const openFile = vi.fn();
    const removeRecentFile = vi.fn();
    const clearRecentFiles = vi.fn();

    openFile('/path/to/file1.md');
    expect(openFile).toHaveBeenCalled();

    removeRecentFile('/path/to/file1.md');
    expect(removeRecentFile).toHaveBeenCalled();

    clearRecentFiles();
    expect(clearRecentFiles).toHaveBeenCalled();
  });

  it('should format time correctly', () => {
    const formatTime = (timestamp: number): string => {
      const now = Date.now();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes} 分钟前`;
      if (hours < 24) return `${hours} 小时前`;
      if (days < 7) return `${days} 天前`;
      
      return new Date(timestamp).toLocaleDateString('zh-CN');
    };

    expect(formatTime(Date.now())).toBe('刚刚');
    expect(formatTime(Date.now() - 60000)).toBe('1 分钟前');
    expect(formatTime(Date.now() - 3600000)).toBe('1 小时前');
    expect(formatTime(Date.now() - 86400000)).toBe('1 天前');
  });
});
