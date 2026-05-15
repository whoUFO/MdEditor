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
    result = this.renderVariables(result, variables);
    result = this.renderConditionals(result, options);
    result = this.injectStyles(result, options);
    return result;
  }

  private static generateStyles(options: TemplateOptions): string {
    const themeStyles = this.getThemeStyles(options.theme);
    const customStyles = options.customCSS || '';

    return `
      :root {
        --font-family: ${options.fontFamily};
        --font-size: ${options.fontSize}px;
        --line-height: ${options.lineHeight};
        --max-width: ${options.maxWidth};
        --highlight-theme: ${options.highlightTheme};
      }
      ${themeStyles}
      ${customStyles}
    `.trim();
  }

  private static getThemeStyles(theme: 'light' | 'dark' | 'custom'): string {
    const themes: Record<string, string> = {
      light: `
        body {
          background: #ffffff;
          color: #1a1a1a;
        }
        a { color: #0066cc; }
        code { background: #f5f5f5; }
        pre { background: #f5f5f5; }
      `,
      dark: `
        body {
          background: #1a1a1a;
          color: #e0e0e0;
        }
        a { color: #66b3ff; }
        code { background: #2d2d2d; }
        pre { background: #2d2d2d; }
      `,
      custom: '',
    };

    return themes[theme] || themes.light;
  }
}
