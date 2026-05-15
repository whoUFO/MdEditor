import { ExportTemplate } from '../types';

export const DEFAULT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>{{style}}</style>
</head>
<body>
  <article class="markdown-body">
    {{#if showTOC}}
    <nav class="toc">{{toc}}</nav>
    {{/if}}
    <header class="article-header">
      <h1 class="article-title">{{title}}</h1>
      {{#if author}}
      <div class="article-meta">
        <span class="article-author">{{author}}</span>
        <span class="article-date">{{date}}</span>
      </div>
      {{/if}}
    </header>
    <div class="article-content">{{{content}}}</div>
    {{#if showPageNumbers}}
    <footer class="article-footer">
      <span class="page-number"></span>
    </footer>
    {{/if}}
  </article>
</body>
</html>
`;

export const DEFAULT_EXPORT_TEMPLATE: ExportTemplate = {
  id: 'default',
  name: 'Default Template',
  description: 'Simple and clean HTML export template',
  template: DEFAULT_TEMPLATE,
  defaultOptions: {
    theme: 'light',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: '800px',
    showTOC: true,
    showPageNumbers: false,
    printOptimized: false,
    highlightTheme: 'github',
    mathEnabled: false,
  },
};
