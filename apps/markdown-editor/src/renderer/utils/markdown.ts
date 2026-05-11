import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeHighlight)
  .use(rehypeSanitize)
  .use(rehypeStringify);

export async function renderMarkdown(content: string): Promise<string> {
  const result = await processor.process(content);
  const html = String(result);
  return DOMPurify.sanitize(html);
}

export function parseToc(content: string): { level: number; text: string; id: string }[] {
  const lines = content.split('\n');
  const toc: { level: number; text: string; id: string }[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      toc.push({
        level: match[1].length,
        text: match[2].trim(),
        id: match[2].trim().toLowerCase().replace(/\s+/g, '-'),
      });
    }
  });

  return toc;
}
