export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FontSettings {
  titleFont: string;
  titleSize: number;
  bodyFont: string;
  bodySize: number;
  lineHeight: 'single' | '1.5x' | 'double' | 'custom';
  customLineHeight: number;
}

export interface ExportPageSettings {
  paperSize: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | 'custom';
  customWidth: number;
  customHeight: number;
  margins: PageMargins;
  marginUnit: 'mm' | 'cm' | 'inch';
  fonts: FontSettings;
}

export interface TemplateOptions {
  theme: 'light' | 'dark' | 'custom';
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  maxWidth: string;
  showTOC: boolean;
  showPageNumbers: boolean;
  printOptimized: boolean;
  highlightTheme: string;
  mathEnabled: boolean;
  customCSS?: string;
  pageSettings?: ExportPageSettings;
}

export interface TemplateVariables {
  title: string;
  content: string;
  date: string;
  author: string;
  toc: string;
  style: string;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  defaultOptions: TemplateOptions;
  thumbnail?: string;
}

export interface ExportConfig {
  templateId: string;
  options: Partial<TemplateOptions>;
  variables?: Partial<TemplateVariables>;
}

export interface ExportResult {
  success: boolean;
  html?: string;
  error?: string;
  metadata?: {
    templateId: string;
    generatedAt: string;
    options: TemplateOptions;
  };
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}
