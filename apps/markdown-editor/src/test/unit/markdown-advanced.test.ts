import { describe, it, expect, vi } from 'vitest';
import { renderMarkdown } from '../../renderer/utils/markdown';

describe('Advanced Markdown Parsing', () => {
  it('should parse tables', async () => {
    const result = await renderMarkdown('| H1 | H2 |\n|----|----|\n| A  | B  |');
    expect(result).toContain('table');
  });

  it('should parse blockquotes', async () => {
    const result = await renderMarkdown('> This is a quote');
    expect(result).toContain('blockquote');
  });

  it('should parse links', async () => {
    const result = await renderMarkdown('[text](url)');
    expect(result).toContain('a');
  });

  it('should parse images', async () => {
    const result = await renderMarkdown('![alt](url)');
    expect(result).toContain('img');
  });
});
