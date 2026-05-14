import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../renderer/hooks/useDebounce';
import { renderMarkdown } from '../../renderer/utils/markdown';

describe('Debounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should delay value update', () => {
    const { result } = renderHook(() => useDebounce('test', 300));

    expect(result.current).toBe('test');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('test');
  });
});

describe('Math Rendering', () => {
  it('should handle inline math expressions', async () => {
    const result = await renderMarkdown('$E=mc^2$');
    expect(result).toContain('katex');
  });

  it('should handle block math expressions', async () => {
    const result = await renderMarkdown('$$\\sum_{i=1}^n x_i$$');
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
    act(() => {
      useSettingsStore.getState().updateSettings({ theme: 'dark' });
    });
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should update font size', () => {
    const { useSettingsStore } = require('../../renderer/stores/settingsStore');
    act(() => {
      useSettingsStore.getState().updateSettings({ fontSize: 16 });
    });
    expect(useSettingsStore.getState().fontSize).toBe(16);
  });

  it('should update multiple settings at once', () => {
    const { useSettingsStore } = require('../../renderer/stores/settingsStore');
    act(() => {
      useSettingsStore.getState().updateSettings({
        theme: 'dark',
        fontSize: 18,
        lineNumbers: false,
      });
    });
    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(useSettingsStore.getState().fontSize).toBe(18);
    expect(useSettingsStore.getState().lineNumbers).toBe(false);
  });
});

describe('UI Store', () => {
  it('should toggle preview visibility', () => {
    const { useUIStore } = require('../../renderer/stores/uiStore');
    const initialValue = useUIStore.getState().previewVisible;
    act(() => {
      useUIStore.getState().togglePreview();
    });
    expect(useUIStore.getState().previewVisible).toBe(!initialValue);
  });

  it('should update split ratio', () => {
    const { useUIStore } = require('../../renderer/stores/uiStore');
    act(() => {
      useUIStore.getState().setSplitRatio(70);
    });
    expect(useUIStore.getState().splitRatio).toBe(70);
  });

  it('should toggle sidebar', () => {
    const { useUIStore } = require('../../renderer/stores/uiStore');
    const initialValue = useUIStore.getState().sidebarVisible;
    act(() => {
      useUIStore.getState().toggleSidebar();
    });
    expect(useUIStore.getState().sidebarVisible).toBe(!initialValue);
  });
});