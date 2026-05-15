import { TemplateOptions } from './types';

export const DEFAULT_TEMPLATE_OPTIONS: TemplateOptions = {
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
};

export const SUPPORTED_THEMES = ['light', 'dark', 'custom'] as const;

export const SUPPORTED_HIGHLIGHT_THEMES = [
  'github',
  'monokai',
  'dracula',
  'nord',
  'solarized',
] as const;

export const TEMPLATE_IDS = {
  DEFAULT: 'default',
  MINIMAL: 'minimal',
  ACADEMIC: 'academic',
  PRESENTATION: 'presentation',
} as const;
