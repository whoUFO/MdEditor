import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { ExportConfig, ExportResult, ExportTemplate } from './types';
import { TemplateEngine } from './engine';
import { TOCHelper } from './toc';
import { ALL_TEMPLATES, DEFAULT_EXPORT_TEMPLATE } from './templates';

export class HTMLExporter {
  private templates: Map<string, ExportTemplate>;

  constructor(templates: ExportTemplate[] = ALL_TEMPLATES) {
    this.templates = new Map();
    templates.forEach(t => this.registerTemplate(t));
  }

  registerTemplate(template: ExportTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplates(): ExportTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): ExportTemplate | undefined {
    return this.templates.get(id);
  }

  async export(renderedHTML: string, config: ExportConfig): Promise<ExportResult> {
    try {
      const template = this.templates.get(config.templateId) || DEFAULT_EXPORT_TEMPLATE;
      const options = { ...template.defaultOptions, ...config.options };

      const cleanHTML = this.sanitize(renderedHTML);
      const toc = this.extractTOC(cleanHTML);
      const tocHTML = options.showTOC ? TOCHelper.render(toc) : '';

      const variables = {
        title: config.variables?.title || 'Untitled',
        content: cleanHTML,
        date: config.variables?.date || new Date().toISOString().split('T')[0],
        author: config.variables?.author || '',
        toc: tocHTML,
        style: '', // TemplateEngine will replace this
      };

      const html = TemplateEngine.renderFull(template.template, variables, options);

      return {
        success: true,
        html,
        metadata: {
          templateId: template.id,
          generatedAt: new Date().toISOString(),
          options,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  download(html: string, filename = 'export.html'): void {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  preview(html: string): void {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  private sanitize(html: string): string {
    const window = new JSDOM('').window;
    return DOMPurify(window).sanitize(html);
  }

  private extractTOC(html: string): Array<{ id: string; text: string; level: number }> {
    const dom = new JSDOM(html);
    const headings = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    return Array.from(headings).map(h => {
      const level = parseInt(h.tagName[1], 10);
      const text = h.textContent || '';
      let id = h.id;

      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        h.id = id;
      }

      return { id, text, level };
    });
  }
}
