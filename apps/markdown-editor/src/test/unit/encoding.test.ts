import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDebounce } from '../../renderer/hooks/useDebounce';

describe('Debounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = useDebounce(fn, 300);

    debouncedFn('test');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should reset timer on multiple calls', () => {
    const fn = vi.fn();
    const debouncedFn = useDebounce(fn, 300);

    debouncedFn('first');
    vi.advanceTimersByTime(200);
    debouncedFn('second');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('second');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('Math Rendering', () => {
  it('should handle inline math expressions', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('$E=mc^2$');
    expect(result).toContain('katex');
  });

  it('should handle block math expressions', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('$$\\sum_{i=1}^n x_i$$');
    expect(result).toContain('katex');
  });
});

describe('File Tree Utils', () => {
  it('should sort directories before files', () => {
    const items = [
      { name: 'file.md', path: '/file.md', type: 'file' as const },
      { name: 'docs', path: '/docs', type: 'directory' as const },
      { name: 'readme.md', path: '/readme.md', type: 'file' as const },
    ];

    const sorted = [...items].sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });

    expect(sorted[0].type).toBe('directory');
    expect(sorted[1].type).toBe('file');
    expect(sorted[2].type).toBe('file');
  });

  it('should filter hidden files', () => {
    const items = [
      { name: '.gitignore', path: '/.gitignore', type: 'file' as const },
      { name: 'visible.md', path: '/visible.md', type: 'file' as const },
      { name: '.hidden', path: '/.hidden', type: 'directory' as const },
    ];

    const filtered = items.filter(item => !item.name.startsWith('.'));
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('visible.md');
  });
});

describe('Settings Store', () => {
  it('should update theme setting', () => {
    const { useSettingsStore } = require('../../renderer/stores/settingsStore');
    useSettingsStore.setState({ theme: 'dark' });
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should update font size', () => {
    const { useSettingsStore } = require('../../renderer/stores/settingsStore');
    useSettingsStore.setState({ fontSize: 16 });
    expect(useSettingsStore.getState().fontSize).toBe(16);
  });

  it('should update multiple settings at once', () => {
    const { useSettingsStore } = require('../../renderer/stores/settingsStore');
    useSettingsStore.getState().updateSettings({
      theme: 'dark',
      fontSize: 18,
      lineNumbers: false,
    });
    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(useSettingsStore.getState().fontSize).toBe(18);
    expect(useSettingsStore.getState().lineNumbers).toBe(false);
  });
});

describe('UI Store', () => {
  it('should toggle preview visibility', () => {
    const { useUIStore } = require('../../renderer/stores/uiStore');
    useUIStore.setState({ previewVisible: true });
    useUIStore.getState().togglePreview();
    expect(useUIStore.getState().previewVisible).toBe(false);
  });

  it('should update split ratio', () => {
    const { useUIStore } = require('../../renderer/stores/uiStore');
    useUIStore.getState().setSplitRatio(0.7);
    expect(useUIStore.getState().splitRatio).toBe(0.7);
  });

  it('should toggle sidebar', () => {
    const { useUIStore } = require('../../renderer/stores/uiStore');
    useUIStore.setState({ sidebarVisible: true });
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarVisible).toBe(false);
  });
});
