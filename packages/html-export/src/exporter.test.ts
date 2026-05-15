import { describe, it, expect } from 'vitest';
import { TemplateEngine } from './engine';
import { TOCHelper } from './toc';
import { HTMLExporter } from './exporter';
import { ALL_TEMPLATES } from './templates';

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
    expect(result).toContain('Arial');
    expect(result).toContain('14px');
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
  it('should create exporter with all templates', () => {
    const exporter = new HTMLExporter();
    const templates = exporter.getTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(5);
    expect(exporter.getTemplate('minimal')).toBeDefined();
    expect(exporter.getTemplate('documentation')).toBeDefined();
    expect(exporter.getTemplate('blog')).toBeDefined();
    expect(exporter.getTemplate('print')).toBeDefined();
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
    expect(templates.length).toBeGreaterThanOrEqual(6);
    expect(exporter.getTemplate('custom')).toBeDefined();
  });

  it('should export HTML with default template', async () => {
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

  it('should export HTML with minimal template', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'minimal',
      options: {},
      variables: { title: 'Minimal Test' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Minimal Test');
  });

  it('should export HTML with documentation template', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1><h2>Section</h2>', {
      templateId: 'documentation',
      options: {},
      variables: { title: 'Doc Test', author: 'Author' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Doc Test');
    expect(result.html).toContain('sidebar');
  });

  it('should export HTML with blog template', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'blog',
      options: {},
      variables: { title: 'Blog Test', author: 'Blogger' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Blog Test');
    expect(result.html).toContain('blog-header');
  });

  it('should export HTML with print template', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'print',
      options: {},
      variables: { title: 'Print Test' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Print Test');
    expect(result.html).toContain('print-article');
  });

  it('should export with dark theme', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'default',
      options: { theme: 'dark' },
      variables: { title: 'Dark Theme' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('#111827');
  });
});

describe('ALL_TEMPLATES', () => {
  it('should have all templates', () => {
    const templateIds = ALL_TEMPLATES.map(t => t.id);
    expect(templateIds).toContain('default');
    expect(templateIds).toContain('minimal');
    expect(templateIds).toContain('documentation');
    expect(templateIds).toContain('blog');
    expect(templateIds).toContain('print');
  });

  it('should have valid template structure', () => {
    ALL_TEMPLATES.forEach(template => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.template).toBeTruthy();
      expect(template.defaultOptions).toBeTruthy();
    });
  });
});
