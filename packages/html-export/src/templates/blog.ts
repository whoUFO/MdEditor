import { ExportTemplate } from '../types';

export const BLOG_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>{{style}}</style>
</head>
<body>
  <header class="blog-header">
    <div class="blog-header-inner">
      {{#if author}}
      <div class="blog-author-badge">
        <span class="blog-author">{{author}}</span>
      </div>
      {{/if}}
      <h1 class="blog-title">{{title}}</h1>
      <div class="blog-meta">
        <span class="blog-date">{{date}}</span>
      </div>
    </div>
  </header>
  <main class="blog-main">
    {{#if showTOC}}
    <div class="blog-toc-box">
      <h4>Outline</h4>
      <nav class="toc">{{toc}}</nav>
    </div>
    {{/if}}
    <article class="blog-article">{{{content}}}</article>
  </main>
  <footer class="blog-footer">
    <p>Generated with ❤️</p>
  </footer>
</body>
</html>
`;

export const BLOG_EXPORT_TEMPLATE: ExportTemplate = {
  id: 'blog',
  name: 'Blog',
  description: '博客风格，响应式设计，适合文章发布',
  template: BLOG_TEMPLATE,
  defaultOptions: {
    theme: 'light',
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    lineHeight: 1.8,
    maxWidth: '768px',
    showTOC: true,
    showPageNumbers: false,
    printOptimized: false,
    highlightTheme: 'github',
    mathEnabled: false,
  },
};
