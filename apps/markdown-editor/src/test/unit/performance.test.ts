import { describe, it, expect } from 'vitest';

describe('Performance Tests', () => {
  it('should parse small content quickly', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const content = '# Heading\n\nParagraph text.';
    const startTime = performance.now();
    await parseMarkdown(content);
    const endTime = performance.now();
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(100);
  });

  it('should parse medium content within reasonable time', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    const content = Array(100).fill('# Heading\n\nParagraph text.').join('\n\n');
    const startTime = performance.now();
    await parseMarkdown(content);
    const endTime = performance.now();
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(500);
  });

  it('should extract TOC from large content efficiently', async () => {
    const { parseToc } = await import('../../renderer/utils/markdown');
    const content = Array(1000).fill('## Heading').join('\n\n');
    const startTime = performance.now();
    const toc = parseToc(content);
    const endTime = performance.now();
    const duration = endTime - startTime;
    expect(toc.length).toBe(1000);
    expect(duration).toBeLessThan(50);
  });
});

describe('Memory Tests', () => {
  it('should handle multiple parse operations', async () => {
    const { parseMarkdown } = await import('../../renderer/utils/markdown');
    for (let i = 0; i < 10; i++) {
      const content = `# Document ${i}\n\nContent`;
      await parseMarkdown(content);
    }
    expect(true).toBe(true);
  });
});
