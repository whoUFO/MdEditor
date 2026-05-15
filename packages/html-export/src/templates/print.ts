import { ExportTemplate } from '../types';

export const PRINT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>{{style}}</style>
</head>
<body>
  <article class="print-article">
    <header class="print-header">
      <h1 class="print-title">{{title}}</h1>
      {{#if author}}
      <div class="print-meta">
        <span class="print-author">{{author}}</span>
        <span class="print-date">{{date}}</span>
      </div>
      {{/if}}
    </header>
    {{#if showTOC}}
    <div class="print-toc">
      <h2>Table of Contents</h2>
      <nav class="toc">{{toc}}</nav>
    </div>
    {{/if}}
    <div class="print-content">{{{content}}}</div>
    {{#if showPageNumbers}}
    <footer class="print-footer">
      <span class="page-number"></span>
    </footer>
    {{/if}}
  </article>
</body>
</html>
`;

export const PRINT_EXPORT_TEMPLATE: ExportTemplate = {
  id: 'print',
  name: 'Print',
  description: '打印优化，分页支持，A4 尺寸适配',
  template: PRINT_TEMPLATE,
  defaultOptions: {
    theme: 'light',
    fontFamily: 'Times New Roman, serif',
    fontSize: 12,
    lineHeight: 1.5,
    maxWidth: '100%',
    showTOC: true,
    showPageNumbers: true,
    printOptimized: true,
    highlightTheme: 'github',
    mathEnabled: false,
  },
};
