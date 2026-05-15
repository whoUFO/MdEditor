import { describe, it, expect } from 'vitest';
import { TemplateEngine } from './engine';
import { TOCHelper } from './toc';
import { HTMLExporter } from './exporter';

describe('TemplateEngine', () => {
  it('should render variables', () => {
    const template = 'Hello {{title}}!';
    const variables = { title: 'World' };
    const result = TemplateEngine.renderVariables(template, variables as any);
    expect(result).toBe('Hello World!');
  });

  it('should render conditionals', () => {
    const template = '{{#if show}}visible{{/if}}';
    const result = TemplateEngine.renderConditionals(template, { show: true } as any);
    expect(result).toBe('visible');
  });

  it('should inject styles', () => {
    const template = '<style>{{style}}</style>';
    const options = {
      theme: 'light' as const,
      fontFamily: 'Arial',
      fontSize: 14,
      lineHeight: 1.5,
      maxWidth: '100%',
      showTOC: true,
      showPageNumbers: false,
      printOptimized: false,
      highlightTheme: 'github' as const,
      mathEnabled: false,
    };
    const result = TemplateEngine.injectStyles(template, options);
    expect(result).toContain('--font-family: Arial');
  });
});

describe('TOCHelper', () => {
  it('should parse markdown headings', () => {
    const markdown = '# Title\n\n## Section\n\n### Subsection';
    const toc = TOCHelper.parse(markdown);
    expect(toc).toHaveLength(3);
    expect(toc[0].level).toBe(1);
    expect(toc[1].level).toBe(2);
  });

  it('should render TOC as HTML', () => {
    const items = [
      { id: 'title', text: 'Title', level: 1, children: [] },
      { id: 'section', text: 'Section', level: 2, children: [] },
    ];
    const html = TOCHelper.render(items);
    expect(html).toContain('<nav class="toc">');
    expect(html).toContain('<a href="#title">Title</a>');
  });

  it('should build nested tree', () => {
    const markdown = '# H1\n## H2\n### H3\n## H2-2\n# H1-2';
    const items = TOCHelper.parse(markdown);
    const toc = TOCHelper.buildTree(items);
    expect(toc[0].children).toHaveLength(2);
    expect(toc[0].children![0].children).toHaveLength(1);
  });
});

describe('HTMLExporter', () => {
  it('should create exporter with default template', () => {
    const exporter = new HTMLExporter();
    const templates = exporter.getTemplates();
    expect(templates).toHaveLength(1);
    expect(templates[0].id).toBe('default');
  });

  it('should register custom template', () => {
    const exporter = new HTMLExporter();
    exporter.registerTemplate({
      id: 'custom',
      name: 'Custom',
      description: 'Custom template',
      template: '<html>{{content}}</html>',
      defaultOptions: {} as any,
    });
    const templates = exporter.getTemplates();
    expect(templates).toHaveLength(2);
    expect(exporter.getTemplate('custom')).toBeDefined();
  });

  it('should export HTML', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'default',
      options: {},
      variables: { title: 'Test Document' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Test Document');
    expect(result.html).toContain('<h1>Test</h1>');
  });
});
