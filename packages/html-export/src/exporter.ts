import DOMPurify from 'dompurify';
import { ExportConfig, ExportResult, ExportTemplate, TemplateOptions, ExportPageSettings } from './types';
import { TemplateEngine } from './engine';
import { TOCHelper } from './toc';
import { ALL_TEMPLATES, DEFAULT_EXPORT_TEMPLATE } from './templates';

const isBrowser = typeof window !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions?.node;

const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
  A3: { width: 297, height: 420 },
  A5: { width: 148, height: 210 },
};

const LINE_HEIGHT_VALUES: Record<string, number> = {
  single: 1.2,
  '1.5x': 1.5,
  double: 2.0,
};

function convertToMM(value: number, unit: 'mm' | 'cm' | 'inch'): number {
  switch (unit) {
    case 'cm':
      return value * 10;
    case 'inch':
      return value * 25.4;
    default:
      return value;
  }
}

function generatePageCSS(pageSettings: ExportPageSettings): string {
  const paperSize = pageSettings.paperSize;
  const isCustom = paperSize === 'custom';
  const width = isCustom ? pageSettings.customWidth : PAPER_SIZES[paperSize].width;
  const height = isCustom ? pageSettings.customHeight : PAPER_SIZES[paperSize].height;
  
  const margins = pageSettings.margins;
  const unit = pageSettings.marginUnit;
  
  const top = convertToMM(margins.top, unit);
  const right = convertToMM(margins.right, unit);
  const bottom = convertToMM(margins.bottom, unit);
  const left = convertToMM(margins.left, unit);
  
  const lineHeight = pageSettings.fonts.lineHeight === 'custom' 
    ? pageSettings.fonts.customLineHeight 
    : LINE_HEIGHT_VALUES[pageSettings.fonts.lineHeight];

  return `
@page {
  size: ${width}mm ${height}mm;
  margin: ${top}mm ${right}mm ${bottom}mm ${left}mm;
}

body {
  font-family: ${pageSettings.fonts.bodyFont}, sans-serif;
  font-size: ${pageSettings.fonts.bodySize}px;
  line-height: ${lineHeight};
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${pageSettings.fonts.titleFont}, serif;
}

h1 { font-size: ${pageSettings.fonts.titleSize}px; }
h2 { font-size: ${pageSettings.fonts.titleSize * 0.85}px; }
h3 { font-size: ${pageSettings.fonts.titleSize * 0.7}px; }
h4 { font-size: ${pageSettings.fonts.titleSize * 0.6}px; }
h5 { font-size: ${pageSettings.fonts.titleSize * 0.55}px; }
h6 { font-size: ${pageSettings.fonts.titleSize * 0.5}px; }

@media print {
  body {
    font-family: ${pageSettings.fonts.bodyFont}, sans-serif;
    font-size: ${pageSettings.fonts.bodySize}px;
    line-height: ${lineHeight};
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${pageSettings.fonts.titleFont}, serif;
  }
}
  `.trim();
}

/**
 * Parse HTML string into DOM in browser or Node.js environment
 */
function parseHTML(html: string): Document {
  if (isBrowser) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
  // Node.js environment - dynamic import of jsdom
  const { JSDOM } = require('jsdom');
  return new JSDOM(html).window.document;
}

/**
 * Create a window object for DOMPurify in browser or Node.js environment
 */
function getSanitizeWindow(): Window {
  if (isBrowser) {
    return window;
  }
  const { JSDOM } = require('jsdom');
  return new JSDOM('').window;
}

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

  getDefaultOptions(templateId: string): TemplateOptions | undefined {
    const template = this.templates.get(templateId);
    return template?.defaultOptions;
  }

  async export(renderedHTML: string, config: ExportConfig): Promise<ExportResult> {
    try {
      const template = this.templates.get(config.templateId) || DEFAULT_EXPORT_TEMPLATE;
      const options = { ...template.defaultOptions, ...config.options };

      const cleanHTML = this.sanitize(renderedHTML);
      const toc = this.extractTOC(cleanHTML);
      const tocHTML = options.showTOC ? TOCHelper.render(toc) : '';

      const pageCSS = options.pageSettings ? generatePageCSS(options.pageSettings) : '';

      const variables = {
        title: config.variables?.title || 'Untitled',
        content: cleanHTML,
        date: config.variables?.date || new Date().toISOString().split('T')[0],
        author: config.variables?.author || '',
        toc: tocHTML,
        style: pageCSS,
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
    if (!isBrowser) {
      console.warn('download() is only available in browser environment');
      return;
    }

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  preview(html: string, title = 'Preview'): void {
    if (!isBrowser) {
      console.warn('preview() is only available in browser environment');
      return;
    }

    const win = window.open('', '_blank', 'width=1200,height=800');
    if (win) {
      win.document.write(html);
      win.document.title = title;
      win.document.close();
    }
  }

  async saveFile(html: string, filepath: string): Promise<boolean> {
    if (!isNode) {
      console.warn('saveFile() is only available in Node.js environment');
      return false;
    }

    try {
      const fs = await import('fs/promises');
      await fs.writeFile(filepath, html, 'utf-8');
      return true;
    } catch (error) {
      console.error('Failed to save file:', error);
      return false;
    }
  }

  async getHTMLAsDataUrl(html: string): Promise<string> {
    const blob = new Blob([html], { type: 'text/html' });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  getExportInfo(): {
    templateCount: number;
    templateIds: string[];
    supportedThemes: string[];
    isBrowser: boolean;
    isNode: boolean;
  } {
    return {
      templateCount: this.templates.size,
      templateIds: Array.from(this.templates.keys()),
      supportedThemes: ['light', 'dark', 'custom'],
      isBrowser,
      isNode: Boolean(isNode),
    };
  }

  private sanitize(html: string): string {
    if (isBrowser) {
      return DOMPurify.sanitize(html);
    }
    const window = getSanitizeWindow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return DOMPurify(window as any).sanitize(html);
  }

  private extractTOC(html: string): Array<{ id: string; text: string; level: number }> {
    const doc = parseHTML(html);
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

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
