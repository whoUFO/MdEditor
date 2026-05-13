import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../../renderer/utils/markdown';

describe('Markdown Parser', () => {
  it('should parse heading correctly', async () => {
    const result = await parseMarkdown('# 标题');
    expect(result).toContain('h1');
    expect(result).toContain('标题');
  });

  it('should parse paragraph correctly', async () => {
    const result = await parseMarkdown('正文内容');
    expect(result).toContain('p');
    expect(result).toContain('正文内容');
  });

  it('should parse bold text correctly', async () => {
    const result = await parseMarkdown('**粗体**');
    expect(result).toContain('strong');
    expect(result).toContain('粗体');
  });

  it('should parse italic text correctly', async () => {
    const result = await parseMarkdown('*斜体*');
    expect(result).toContain('em');
    expect(result).toContain('斜体');
  });

  it('should parse code block correctly', async () => {
    const result = await parseMarkdown('```js\nconst x = 1;\n```');
    expect(result).toContain('pre');
    expect(result).toContain('code');
    expect(result).toContain('const x = 1;');
  });

  it('should parse list correctly', async () => {
    const result = await parseMarkdown('- 项目1\n- 项目2');
    expect(result).toContain('ul');
    expect(result).toContain('li');
  });

  it('should remove script tags', async () => {
    const result = await parseMarkdown('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove event handlers', async () => {
    const result = await parseMarkdown('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
  });
});
