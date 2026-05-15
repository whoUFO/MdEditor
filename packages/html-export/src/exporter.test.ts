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

  it('should get default options', () => {
    const exporter = new HTMLExporter();
    const options = exporter.getDefaultOptions('minimal');
    expect(options).toBeDefined();
    expect(options?.showTOC).toBe(false);
  });

  it('should return undefined for unknown template default options', () => {
    const exporter = new HTMLExporter();
    const options = exporter.getDefaultOptions('nonexistent');
    expect(options).toBeUndefined();
  });

  it('should get export info', () => {
    const exporter = new HTMLExporter();
    const info = exporter.getExportInfo();
    expect(info.templateCount).toBeGreaterThanOrEqual(5);
    expect(info.templateIds).toContain('default');
    expect(info.templateIds).toContain('minimal');
    expect(info.supportedThemes).toContain('light');
    expect(info.supportedThemes).toContain('dark');
  });

  it('should return error for invalid export', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('', {
      templateId: 'nonexistent',
      options: {},
    });
    expect(result.success).toBe(true);
    expect(result.html).toBeDefined();
  });

  it('should merge custom options with defaults', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'minimal',
      options: {
        fontSize: 20,
        fontFamily: 'Custom Font',
      },
      variables: { title: 'Custom Test' },
    });
    expect(result.success).toBe(true);
    expect(result.metadata?.options.fontSize).toBe(20);
    expect(result.metadata?.options.fontFamily).toBe('Custom Font');
    expect(result.html).toContain('Custom Font');
  });

  it('should include metadata in result', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'default',
      options: {},
      variables: { title: 'Metadata Test' },
    });
    expect(result.success).toBe(true);
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.templateId).toBe('default');
    expect(result.metadata?.generatedAt).toBeDefined();
    expect(result.metadata?.options).toBeDefined();
  });

  it('should handle missing title gracefully', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'default',
      options: {},
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Untitled');
  });

  it('should handle missing author gracefully', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'documentation',
      options: {},
      variables: { title: 'Test' },
    });
    expect(result.success).toBe(true);
    expect(result.html).not.toContain('By undefined');
  });

  it('should export with TOC enabled', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export(
      '<h1 id="title">Title</h1><h2 id="section">Section</h2>',
      {
        templateId: 'default',
        options: { showTOC: true },
        variables: { title: 'TOC Test' },
      }
    );
    expect(result.success).toBe(true);
    expect(result.html).toContain('<nav class="toc">');
    expect(result.html).toContain('href="#title"');
  });

  it('should export without TOC when disabled', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export(
      '<h1 id="title">Title</h1><h2 id="section">Section</h2>',
      {
        templateId: 'minimal',
        options: { showTOC: false },
        variables: { title: 'No TOC Test' },
      }
    );
    expect(result.success).toBe(true);
    expect(result.html).not.toContain('<nav class="toc">');
  });

  it('should export with print optimized styles', async () => {
    const exporter = new HTMLExporter();
    const result = await exporter.export('<h1>Test</h1>', {
      templateId: 'print',
      options: { printOptimized: true },
      variables: { title: 'Print Optimized' },
    });
    expect(result.success).toBe(true);
    expect(result.html).toContain('@media print');
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

  it('should have unique template IDs', () => {
    const ids = ALL_TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
