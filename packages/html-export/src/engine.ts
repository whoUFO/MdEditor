import { TemplateOptions, TemplateVariables } from './types';

export class TemplateEngine {
  static renderVariables(template: string, variables: TemplateVariables): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      result = result.replace(regex, String(value ?? ''));
    }

    return result;
  }

  static renderConditionals(template: string, options: TemplateOptions): string {
    let result = template;

    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_match, key, content) => {
      const value = (options as unknown as Record<string, unknown>)[key];
      return value ? content : '';
    });

    result = result.replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (_match, key, content) => {
      const value = (options as unknown as Record<string, unknown>)[key];
      return !value ? content : '';
    });

    return result;
  }

  static injectStyles(template: string, options: TemplateOptions): string {
    const styles = this.generateStyles(options);
    return template.replace('{{style}}', styles);
  }

  static renderFull(
    template: string,
    variables: TemplateVariables,
    options: TemplateOptions
  ): string {
    let result = template;
    result = this.injectStyles(result, options); // Inject styles first
    result = this.renderConditionals(result, options);
    result = this.renderVariables(result, variables);
    return result;
  }

  private static generateStyles(options: TemplateOptions): string {
    const themeStyles = this.getThemeStyles(options.theme);
    const layoutStyles = this.getLayoutStyles(options);
    const markdownStyles = this.getMarkdownStyles(options);
    const customStyles = options.customCSS || '';

    return `
      /* Base Styles */
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: ${options.fontFamily};
        font-size: ${options.fontSize}px;
        line-height: ${options.lineHeight};
        ${themeStyles.body}
      }

      /* Layout Styles */
      ${layoutStyles}

      /* Markdown Styles */
      ${markdownStyles}

      /* Custom Styles */
      ${customStyles}
    `.trim();
  }

  private static getThemeStyles(theme: 'light' | 'dark' | 'custom') {
    const themes = {
      light: {
        body: 'background: #ffffff; color: #1f2937;',
        text: '#1f2937',
        muted: '#6b7280',
        border: '#e5e7eb',
        background: '#f9fafb',
        accent: '#3b82f6',
      },
      dark: {
        body: 'background: #111827; color: #f3f4f6;',
        text: '#f3f4f6',
        muted: '#9ca3af',
        border: '#374151',
        background: '#1f2937',
        accent: '#60a5fa',
      },
      custom: {
        body: '',
        text: '',
        muted: '',
        border: '',
        background: '',
        accent: '',
      },
    };
    return themes[theme] || themes.light;
  }

  private static getLayoutStyles(options: TemplateOptions) {
    return `
      .main-content, article, .blog-main, .print-article {
        max-width: ${options.maxWidth};
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      /* Documentation Sidebar */
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 280px;
        height: 100vh;
        padding: 2rem 1.5rem;
        border-right: 1px solid ${this.getThemeStyles(options.theme).border};
        background: ${this.getThemeStyles(options.theme).background};
        overflow-y: auto;
      }
      .main-content {
        margin-left: 280px;
      }
      @media (max-width: 900px) {
        .sidebar { position: static; width: 100%; height: auto; border-right: none; border-bottom: 1px solid ${this.getThemeStyles(options.theme).border}; }
        .main-content { margin-left: 0; }
      }

      /* Blog Styles */
      .blog-header {
        padding: 4rem 1rem 2rem;
        text-align: center;
        border-bottom: 1px solid ${this.getThemeStyles(options.theme).border};
      }
      .blog-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      .blog-meta { color: ${this.getThemeStyles(options.theme).muted}; }
      .blog-toc-box {
        padding: 1.5rem;
        margin: 2rem 0;
        background: ${this.getThemeStyles(options.theme).background};
        border-radius: 8px;
      }
      .blog-footer {
        text-align: center;
        padding: 2rem;
        color: ${this.getThemeStyles(options.theme).muted};
      }

      /* Print Styles */
      ${options.printOptimized ? `
        @media print {
          body { font-size: 12pt; }
          .print-article { max-width: 100%; }
          .print-toc { page-break-after: always; }
        }
      ` : ''}

      /* TOC Styles */
      .toc ul, .toc { list-style: none; }
      .toc li { margin: 0.375rem 0; }
      .toc a {
        color: ${this.getThemeStyles(options.theme).accent};
        text-decoration: none;
      }
      .toc a:hover { text-decoration: underline; }
    `;
  }

  private static getMarkdownStyles(options: TemplateOptions) {
    const theme = this.getThemeStyles(options.theme);
    return `
      h1, h2, h3, h4, h5, h6 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 700;
        line-height: 1.3;
      }
      h1 { font-size: 2.25rem; }
      h2 { font-size: 1.75rem; border-bottom: 1px solid ${theme.border}; padding-bottom: 0.5rem; }
      h3 { font-size: 1.5rem; }
      h4 { font-size: 1.25rem; }
      h5, h6 { font-size: 1rem; }

      p { margin: 1rem 0; }

      a { color: ${theme.accent}; text-decoration: none; }
      a:hover { text-decoration: underline; }

      ul, ol { padding-left: 2rem; margin: 1rem 0; }
      li { margin: 0.25rem 0; }

      blockquote {
        margin: 1rem 0;
        padding: 0.5rem 1rem;
        border-left: 4px solid ${theme.accent};
        background: ${theme.background};
        color: ${theme.muted};
      }

      code {
        background: ${theme.background};
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'SFMono-Regular', Consolas, monospace;
        font-size: 0.875em;
      }

      pre {
        margin: 1rem 0;
        padding: 1rem;
        background: ${theme.background};
        border-radius: 8px;
        overflow-x: auto;
      }
      pre code {
        background: transparent;
        padding: 0;
      }

      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1rem 0;
      }

      table {
        width: 100%;
        margin: 1rem 0;
        border-collapse: collapse;
      }
      th, td {
        padding: 0.75rem 1rem;
        border: 1px solid ${theme.border};
        text-align: left;
      }
      th { background: ${theme.background}; }

      hr {
        margin: 2rem 0;
        border: none;
        border-top: 1px solid ${theme.border};
      }
    `;
  }
}
