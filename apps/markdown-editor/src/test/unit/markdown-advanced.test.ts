import { describe, it, expect } from 'vitest';

describe('Advanced Markdown Parsing', () => {
  it('should parse table correctly', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const input = `
| Name | Age | City |
|------|-----|------|
| Alice | 25 | Beijing |
| Bob | 30 | Shanghai |
`;
    const result = await parseMarkdown(input);
    expect(result).toContain('table');
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
  });

  it('should parse blockquote correctly', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('> This is a quote');
    expect(result).toContain('blockquote');
    expect(result).toContain('This is a quote');
  });

  it('should parse horizontal rule', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('---');
    expect(result).toContain('hr');
  });

  it('should parse links correctly', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('[GitHub](https://github.com)');
    expect(result).toContain('a');
    expect(result).toContain('href');
    expect(result).toContain('GitHub');
  });

  it('should parse images correctly', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('![Alt](image.png)');
    expect(result).toContain('img');
    expect(result).toContain('Alt');
  });

  it('should parse nested lists', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown(`
- Item 1
  - Subitem 1.1
  - Subitem 1.2
- Item 2
`);
    expect(result).toContain('ul');
    expect(result).toContain('li');
  });

  it('should parse task lists', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown(`
- [x] Done task
- [ ] Pending task
`);
    expect(result).toContain('ul');
    expect(result).toContain('input');
  });
});

describe('Security Tests', () => {
  it('should prevent javascript: protocol', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('[Click](javascript:alert(1))');
    expect(result).not.toContain('javascript:');
  });

  it('should sanitize data: URLs', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('<img src="data:text/html,<script>alert(1)</script>">');
    expect(result).not.toContain('data:');
    expect(result).not.toContain('script');
  });

  it('should remove onload handlers', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('<div onload="alert(1)">Test</div>');
    expect(result).not.toContain('onload');
  });

  it('should remove onerror handlers', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
  });

  it('should allow safe markdown syntax', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const result = await parseMarkdown('**bold** and *italic* and `code`');
    expect(result).toContain('strong');
    expect(result).toContain('em');
    expect(result).toContain('code');
  });
});

describe('TOC Parsing', () => {
  it('should extract heading IDs', async () => {
    const { parseToc } = await import('../../renderer/utils/markdown');
    const content = '# Main Title\n## Section 1\n### Subsection';
    const toc = parseToc(content);
    
    expect(toc.length).toBe(3);
    expect(toc[0].id).toBeDefined();
    expect(toc[0].text).toBe('Main Title');
    expect(toc[0].level).toBe(1);
  });

  it('should handle empty content', async () => {
    const { parseToc } = await import('../../renderer/utils/markdown');
    const toc = parseToc('');
    expect(toc.length).toBe(0);
  });

  it('should skip non-heading lines', async () => {
    const { parseToc } = await import('../../renderer/utils/markdown');
    const content = 'Plain text\n# Heading\nparagraph\n## Another Heading';
    const toc = parseToc(content);
    
    expect(toc.length).toBe(2);
    expect(toc.every(item => item.level >= 1 && item.level <= 6)).toBe(true);
  });
});
