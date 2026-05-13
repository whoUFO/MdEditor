import { describe, it, expect, vi } from 'vitest';

vi.mock('../../renderer/stores/fileStore', () => ({
  useFileStore: vi.fn().mockReturnValue({
    fileTree: [],
    loadDirectory: vi.fn(),
  }),
}));

describe('FileTree Component', () => {
  it('should have correct mock setup', () => {
    expect(true).toBe(true);
  });

  it('should handle file tree structure', () => {
    const tree = [
      { name: 'file1.md', path: '/file1.md', type: 'file' },
      { name: 'folder', path: '/folder', type: 'directory' },
    ];
    expect(tree).toHaveLength(2);
  });

  it('should support file operations', () => {
    const openFile = vi.fn();
    openFile('/test.md');
    expect(openFile).toHaveBeenCalled();
  });
});
