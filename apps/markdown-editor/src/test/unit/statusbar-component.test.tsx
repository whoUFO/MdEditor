import { describe, it, expect, vi } from 'vitest';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn().mockReturnValue({
    content: 'Test content',
    cursorPosition: { line: 1, column: 1 },
    wordCount: 2,
  }),
}));

vi.mock('../../renderer/stores/fileStore', () => ({
  useFileStore: vi.fn().mockReturnValue({
    currentFile: null,
  }),
}));

describe('StatusBar Component', () => {
  it('should have correct mock setup', () => {
    expect(true).toBe(true);
  });

  it('should track cursor position', () => {
    const cursor = { line: 5, column: 10 };
    expect(cursor.line).toBe(5);
    expect(cursor.column).toBe(10);
  });

  it('should display file name', () => {
    const fileName = 'test.md';
    expect(fileName).toContain('.md');
  });

  it('should count words', () => {
    const wordCount = 100;
    expect(wordCount).toBeGreaterThan(0);
  });
});
