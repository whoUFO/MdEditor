import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderMarkdown } from '../../renderer/utils/markdown';

describe('Markdown Parser', () => {
  it('should parse headings', async () => {
    const result = await renderMarkdown('# Heading 1');
    expect(result).toContain('h1');
    expect(result).toContain('Heading 1');
  });

  it('should parse paragraphs', async () => {
    const result = await renderMarkdown('This is a paragraph');
    expect(result).toContain('p');
  });

  it('should parse bold text', async () => {
    const result = await renderMarkdown('**bold**');
    expect(result).toContain('strong');
  });

  it('should parse italic text', async () => {
    const result = await renderMarkdown('*italic*');
    expect(result).toContain('em');
  });

  it('should parse code blocks', async () => {
    const result = await renderMarkdown('```\nconst x = 1;\n```');
    expect(result).toContain('pre');
    expect(result).toContain('code');
  });

  it('should parse lists', async () => {
    const result = await renderMarkdown('- item 1\n- item 2');
    expect(result).toContain('ul');
  });
});
