import { ExportTemplate } from '../types';

export const DOCUMENTATION_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>{{style}}</style>
</head>
<body>
  <aside class="sidebar">
    {{#if showTOC}}
    <div class="toc-wrapper">
      <h3>Table of Contents</h3>
      <nav class="toc">{{toc}}</nav>
    </div>
    {{/if}}
  </aside>
  <main class="main-content">
    <article class="doc-article">
      <header class="doc-header">
        <h1 class="doc-title">{{title}}</h1>
        {{#if author}}
        <div class="doc-meta">
          <span class="doc-author">By {{author}}</span>
          <span class="doc-date">{{date}}</span>
        </div>
        {{/if}}
      </header>
      <div class="doc-body">{{{content}}}</div>
    </article>
  </main>
</body>
</html>
`;

export const DOCUMENTATION_EXPORT_TEMPLATE: ExportTemplate = {
  id: 'documentation',
  name: 'Documentation',
  description: '专业文档风格，侧边栏目录，适合技术文档',
  template: DOCUMENTATION_TEMPLATE,
  defaultOptions: {
    theme: 'light',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: '900px',
    showTOC: true,
    showPageNumbers: false,
    printOptimized: false,
    highlightTheme: 'github',
    mathEnabled: false,
  },
};
