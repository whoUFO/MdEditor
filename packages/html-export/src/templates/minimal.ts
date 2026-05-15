import { ExportTemplate } from '../types';

export const MINIMAL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>{{style}}</style>
</head>
<body>
  <article>{{{content}}}</article>
</body>
</html>
`;

export const MINIMAL_EXPORT_TEMPLATE: ExportTemplate = {
  id: 'minimal',
  name: 'Minimal',
  description: '极简风格，专注内容，无多余装饰',
  template: MINIMAL_TEMPLATE,
  defaultOptions: {
    theme: 'light',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: '720px',
    showTOC: false,
    showPageNumbers: false,
    printOptimized: false,
    highlightTheme: 'github',
    mathEnabled: false,
  },
};
