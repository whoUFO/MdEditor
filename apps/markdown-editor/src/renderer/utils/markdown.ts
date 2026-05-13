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
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
});

function remarkAddHeadingIds() {
  return (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      const textNode = node.children.find((child: any) => child.type === 'text');
      if (textNode) {
        const id = textNode.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.id = id;
      }
    });
  };
}

function remarkMermaid() {
  return (tree: any) => {
    visit(tree, 'code', (node: any, index: number, parent: any) => {
      if (node.lang === 'mermaid') {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        parent.children[index] = {
          type: 'html',
          value: `<div class="mermaid" id="${id}">${node.value}</div>`,
        };
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkAddHeadingIds)
  .use(remarkMermaid)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypeHighlight)
  .use(rehypeSanitize, {
    tagNames: [
      'div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'code', 'pre', 'img', 'ul', 'ol', 'li', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr',
      'strong', 'em', 'del', 'ins', 'sup', 'sub',
      'svg', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon',
      'polyline', 'text', 'tspan', 'g', 'defs', 'use', 'marker',
      'linearGradient', 'radialGradient', 'stop', 'pattern',
      'title', 'desc', 'clipPath', 'mask', 'filter', 'feGaussianBlur',
      'feOffset', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
      'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA',
    ],
    attributes: {
      '*': ['id', 'class', 'style'],
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title'],
      'svg': ['viewBox', 'width', 'height', 'xmlns', 'preserveAspectRatio'],
      'path': ['d', 'stroke', 'fill', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
      'rect': ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke', 'stroke-width'],
      'circle': ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width'],
      'ellipse': ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke', 'stroke-width'],
      'line': ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width'],
      'polygon': ['points', 'fill', 'stroke', 'stroke-width'],
      'polyline': ['points', 'fill', 'stroke', 'stroke-width'],
      'text': ['x', 'y', 'font-size', 'font-family', 'text-anchor', 'fill'],
      'tspan': ['x', 'y', 'dx', 'dy', 'font-size'],
      'g': ['transform', 'font-size', 'font-family', 'fill', 'stroke'],
      'defs': [],
      'use': ['href', 'x', 'y', 'width', 'height'],
      'marker': ['id', 'viewBox', 'refX', 'refY', 'markerWidth', 'markerHeight', 'orient'],
      'linearGradient': ['id', 'x1', 'y1', 'x2', 'y2', 'gradientUnits'],
      'radialGradient': ['id', 'cx', 'cy', 'r', 'gradientUnits'],
      'stop': ['offset', 'stop-color', 'stop-opacity'],
      'pattern': ['id', 'patternUnits', 'width', 'height'],
      'title': [],
      'desc': [],
      'clipPath': ['id'],
      'mask': ['id'],
      'filter': ['id'],
      'feGaussianBlur': ['in', 'stdDeviation'],
      'feOffset': ['in', 'dx', 'dy'],
      'feBlend': ['in', 'in2', 'mode'],
      'feColorMatrix': ['in', 'type', 'values'],
      'feComponentTransfer': ['in'],
      'feFuncR': ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'],
      'feFuncG': ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'],
      'feFuncB': ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'],
      'feFuncA': ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'],
    },
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function renderMarkdown(content: string): Promise<string> {
  const result = await processor.process(content);
  const html = String(result);
  
  setTimeout(async () => {
    const mermaidElements = document.querySelectorAll('.mermaid');
    for (const element of mermaidElements) {
      const id = element.id;
      if (id && !element.querySelector('svg')) {
        try {
          const svg = await mermaid.render(id, element.textContent || '');
          element.innerHTML = svg;
        } catch (e) {
          console.error('Mermaid render error:', e);
        }
      }
    }
  }, 0);
  
  return DOMPurify.sanitize(html);
}

export const parseMarkdown = renderMarkdown;

export function parseToc(content: string): { level: number; text: string; id: string }[] {
  const lines = content.split('\n');
  const toc: { level: number; text: string; id: string }[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      toc.push({
        level: match[1].length,
        text,
        id,
      });
    }
  });

  return toc;
}
