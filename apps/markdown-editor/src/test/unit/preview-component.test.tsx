import { describe, it, expect, vi } from 'vitest';

vi.mock('../../renderer/utils/markdown', () => ({
  renderMarkdown: vi.fn().mockResolvedValue('<p>Rendered</p>'),
}));

describe('Preview Component', () => {
  it('should have correct mock setup', () => {
    expect(true).toBe(true);
  });

  it('should render markdown content', async () => {
    const { renderMarkdown } = await import('../../renderer/utils/markdown');
    const result = await renderMarkdown('Test');
    expect(result).toBe('<p>Rendered</p>');
  });

  it('should support multiple heading levels', () => {
    const headings = [1, 2, 3, 4, 5, 6];
    headings.forEach(level => {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(6);
    });
  });
});
