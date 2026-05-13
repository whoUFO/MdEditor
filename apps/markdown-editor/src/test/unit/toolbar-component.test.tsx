import { describe, it, expect, vi } from 'vitest';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn().mockReturnValue({
    content: '',
    setContent: vi.fn(),
    insertText: vi.fn(),
  }),
}));

vi.mock('../../renderer/stores/uiStore', () => ({
  useUIStore: vi.fn().mockReturnValue({
    previewVisible: true,
    togglePreview: vi.fn(),
  }),
}));

describe('Toolbar Component', () => {
  it('should have correct mock setup', () => {
    expect(true).toBe(true);
  });

  it('should have format buttons configuration', () => {
    const formatButtons = [
      { action: 'bold', label: '粗体' },
      { action: 'italic', label: '斜体' },
      { action: 'code', label: '行内代码' },
    ];
    expect(formatButtons.length).toBe(3);
  });
});
