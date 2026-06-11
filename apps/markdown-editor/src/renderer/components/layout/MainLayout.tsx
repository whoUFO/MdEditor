import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Editor } from '../editor/Editor';
import { Preview } from '../preview/Preview';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { FileTree } from '../file-tree/FileTree';
import { TOC } from '../toc/TOC';
import { RecentFiles } from '../recent-files/RecentFiles';
import { ExportDialog } from '../export/ExportDialog';
import { useUIStore } from '../../stores/uiStore';
import { useFileStore } from '../../stores/fileStore';
import { useEditorStore } from '../../stores/editorStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { renderMarkdown } from '../../utils/markdown';
import { FolderOpen, BookOpen, FileText, Download, Clock } from 'lucide-react';
import { HTMLExporter, ALL_TEMPLATES } from '@markdown-editor/html-export';
import type { ExportConfig } from '@markdown-editor/html-export';
import './MainLayout.css';

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

type SidebarTab = 'files' | 'toc' | 'recent';

interface MainLayoutProps {
  onOpenSettings: () => void;
}

export function MainLayout({ onOpenSettings }: MainLayoutProps): React.JSX.Element {
  const { previewVisible, splitRatio, sidebarVisible, toggleSidebar, setSplitRatio } = useUIStore();
  const { currentFile, saveFile } = useFileStore();
  const { content } = useEditorStore();
  const { exportPageSettings } = useSettingsStore();
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('files');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startRatioRef = useRef(50);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startRatioRef.current = splitRatio;
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [splitRatio]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const deltaX = e.clientX - startXRef.current;
    const deltaRatio = (deltaX / containerWidth) * 100;
    let newRatio = startRatioRef.current + deltaRatio;
    
    newRatio = Math.max(20, Math.min(80, newRatio));
    setSplitRatio(newRatio);
  }, [setSplitRatio]);

  const handleResizeEnd = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, []);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  const handleExportWithTemplate = async (config: ExportConfig) => {
    try {
      const html = await renderMarkdown(content);
      const exporter = new HTMLExporter();
      
      const result = await exporter.export(html, {
        ...config,
        variables: {
          ...config.variables,
          content: html,
          title: currentFile?.name?.replace(/\.md$/, '') || 'Untitled',
          date: new Date().toLocaleDateString('zh-CN'),
        },
      });

      if (result.success && result.html) {
        exporter.download(result.html, result.filename || 'document.html');
      } else {
        console.error('Export failed:', result.error);
        alert('导出失败：' + (result.error || '未知错误'));
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handlePreviewWithTemplate = (templateId: string) => {
    const template = ALL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      alert(`模板预览: ${template.name}\n\n${template.description}`);
    }
  };

  const handleExportHTML = async () => {
    const html = await renderMarkdown(content);
    const highlightCSS = `
      .hljs { display: block; overflow-x: auto; padding: 0.5em; color: #333; background: #f8f8f8; }
      .hljs-comment, .hljs-quote { color: #998; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #333; font-weight: bold; }
      .hljs-number, .hljs-literal { color: #008080; }
      .hljs-string { color: #d14; }
      .hljs-title, .hljs-section { color: #900; font-weight: bold; }
      .hljs-type { color: #458; font-weight: bold; }
      .hljs-tag { color: #000080; }
      .hljs-regexp { color: #009926; }
      .hljs-symbol { color: #990073; }
      .hljs-built_in { color: #0086b3; }
      .hljs-meta { color: #999; font-weight: bold; }
    `;
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentFile?.name || 'Document'}</title>
  <style>
    ${highlightCSS}
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    pre { padding: 16px; background: #f6f8fa; border-radius: 6px; overflow-x: auto; }
    code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
    blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin-left: 0; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f6f8fa; }
    img { max-width: 100%; }
  </style>
</head>
<body>${html}</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (currentFile?.name?.replace(/\.md$/, '') || 'document') + '.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    try {
      const html = await renderMarkdown(content);
      
      const pageSettings = exportPageSettings;
      const paperSize = pageSettings.paperSize;
      const isCustom = paperSize === 'custom';
      const pageWidth = isCustom ? pageSettings.customWidth : PAPER_SIZES[paperSize].width;
      const pageHeight = isCustom ? pageSettings.customHeight : PAPER_SIZES[paperSize].height;
      
      const margins = pageSettings.margins;
      const unit = pageSettings.marginUnit;
      const top = convertToMM(margins.top, unit);
      const right = convertToMM(margins.right, unit);
      const bottom = convertToMM(margins.bottom, unit);
      const left = convertToMM(margins.left, unit);
      
      const lineHeight = pageSettings.fonts.lineHeight === 'custom' 
        ? pageSettings.fonts.customLineHeight 
        : LINE_HEIGHT_VALUES[pageSettings.fonts.lineHeight];
      
      const highlightCSS = `
        .hljs { display: block; overflow-x: auto; padding: 0.5em; color: #333; background: #f8f8fa; }
        .hljs-comment, .hljs-quote { color: #998; font-style: italic; }
        .hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #333; font-weight: bold; }
        .hljs-number, .hljs-literal { color: #008080; }
        .hljs-string { color: #d14; }
        .hljs-title, .hljs-section { color: #900; font-weight: bold; }
        .hljs-type { color: #458; font-weight: bold; }
        .hljs-tag { color: #000080; }
        .hljs-regexp { color: #009926; }
        .hljs-symbol { color: #990073; }
        .hljs-built_in { color: #0086b3; }
        .hljs-meta { color: #999; font-weight: bold; }
      `;
      
      const pageNumbers = pageSettings.pageNumbers || {
      enabled: true,
      position: 'bottom-right' as const,
      format: 'page/total' as const,
      fontSize: 12,
      fontColor: '#666666',
    };
    const pageNumberCSS = pageNumbers.enabled ? `
        @page {
          size: ${pageWidth}mm ${pageHeight}mm;
          margin: ${top}mm ${right}mm ${bottom}mm ${left}mm;
          
          @top-left {
            content: ${pageNumbers.position.startsWith('top-left') ? getPageNumberContent() : '""'};
            font-size: ${pageNumbers.fontSize}px;
            color: ${pageNumbers.fontColor};
            font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          }
          @top-center {
            content: ${pageNumbers.position === 'top-center' ? getPageNumberContent() : '""'};
            font-size: ${pageNumbers.fontSize}px;
            color: ${pageNumbers.fontColor};
            font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          }
          @top-right {
            content: ${pageNumbers.position.startsWith('top-right') ? getPageNumberContent() : '""'};
            font-size: ${pageNumbers.fontSize}px;
            color: ${pageNumbers.fontColor};
            font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          }
          @bottom-left {
            content: ${pageNumbers.position.startsWith('bottom-left') ? getPageNumberContent() : '""'};
            font-size: ${pageNumbers.fontSize}px;
            color: ${pageNumbers.fontColor};
            font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          }
          @bottom-center {
            content: ${pageNumbers.position === 'bottom-center' ? getPageNumberContent() : '""'};
            font-size: ${pageNumbers.fontSize}px;
            color: ${pageNumbers.fontColor};
            font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          }
          @bottom-right {
            content: ${pageNumbers.position.startsWith('bottom-right') ? getPageNumberContent() : '""'};
            font-size: ${pageNumbers.fontSize}px;
            color: ${pageNumbers.fontColor};
            font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          }
        }
        
        body {
          counter-reset: page;
        }
        
        .page-number::before {
          counter-increment: page;
        }
      ` : `
        @page {
          size: ${pageWidth}mm ${pageHeight}mm;
          margin: ${top}mm ${right}mm ${bottom}mm ${left}mm;
        }
      `;

    function getPageNumberContent(): string {
      switch (pageNumbers.format) {
        case 'page':
          return 'counter(page)';
        case 'page/total':
          return 'counter(page) "/" counter(pages)';
        case 'page of total':
          return '"第" counter(page) "页，共" counter(pages) "页"';
        default:
          return 'counter(page)';
      }
    }

    const pageCSS = `
        ${pageNumberCSS}
        body {
          font-family: '${pageSettings.fonts.bodyFont}', sans-serif;
          font-size: ${pageSettings.fonts.bodySize}px;
          line-height: ${lineHeight};
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: '${pageSettings.fonts.titleFont}', serif;
        }
        h1 { font-size: ${pageSettings.fonts.titleSize}px; }
        h2 { font-size: ${pageSettings.fonts.titleSize * 0.85}px; }
        h3 { font-size: ${pageSettings.fonts.titleSize * 0.7}px; }
        h4 { font-size: ${pageSettings.fonts.titleSize * 0.6}px; }
        h5 { font-size: ${pageSettings.fonts.titleSize * 0.55}px; }
        h6 { font-size: ${pageSettings.fonts.titleSize * 0.5}px; }
      `;
      
      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentFile?.name || 'Document'}</title>
  <style>
    ${highlightCSS}
    ${pageCSS}
    body {
      max-width: 100%;
      margin: 0;
      padding: 0;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 { 
      margin-top: 1em; 
      margin-bottom: 0.5em; 
      font-weight: 600;
    }
    h1 { border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }
    h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    pre { 
      padding: 16px; 
      background: #f6f8fa; 
      border-radius: 6px; 
      overflow-x: auto;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
    }
    code { 
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      padding: 0.2em 0.4em;
      background: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
      font-size: 85%;
    }
    pre code {
      padding: 0;
      background: none;
      border-radius: 0;
    }
    blockquote { 
      border-left: 4px solid #ddd; 
      padding-left: 16px; 
      margin-left: 0; 
      color: #666;
      background: #f6f8fa;
      padding: 0.5em 1em;
      border-radius: 3px;
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 1em 0;
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 8px 12px; 
      text-align: left; 
    }
    th { 
      background: #f6f8fa; 
      font-weight: 600;
    }
    img { max-width: 100%; }
    a { 
      color: #0366d6; 
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
    ul, ol { padding-left: 2em; }
    li { margin: 0.25em 0; }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
    .mermaid {
      text-align: center;
      margin: 1em 0;
    }
  </style>
</head>
<body>${html}</body>
</html>`;
      
      if (window.electronAPI) {
        await window.electronAPI.exportToPDF(fullHTML, currentFile?.name || 'document', exportPageSettings);
      } else {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(fullHTML);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (error) {
      console.error('[Renderer] Export PDF error:', error);
    }
  };

  return (
    <div className="main-layout" data-testid="main-layout">
      <Toolbar onOpenSettings={onOpenSettings} />
      <div className="editor-container" ref={containerRef}>
        {sidebarVisible && (
          <div className="sidebar" data-testid="sidebar">
            <div className="sidebar-tabs">
              <button
                className={`sidebar-tab ${sidebarTab === 'files' ? 'active' : ''}`}
                onClick={() => setSidebarTab('files')}
              >
                <FolderOpen size={16} />
                <span>文件</span>
              </button>
              <button
                className={`sidebar-tab ${sidebarTab === 'recent' ? 'active' : ''}`}
                onClick={() => setSidebarTab('recent')}
              >
                <Clock size={16} />
                <span>最近</span>
              </button>
              <button
                className={`sidebar-tab ${sidebarTab === 'toc' ? 'active' : ''}`}
                onClick={() => setSidebarTab('toc')}
              >
                <BookOpen size={16} />
                <span>目录</span>
              </button>
            </div>
            <div className="sidebar-content">
              {sidebarTab === 'files' && <FileTree />}
              {sidebarTab === 'recent' && <RecentFiles />}
              {sidebarTab === 'toc' && <TOC />}
            </div>
          </div>
        )}

        <div className="editor-main">
          <div
            className="editor-pane"
            data-testid="editor-pane"
            style={{
              flex: previewVisible ? splitRatio : 1,
              transition: isResizingRef.current ? 'none' : 'flex 0.2s ease'
            }}
          >
            <Editor />
          </div>

          {previewVisible && (
            <>
              <div
                className="resizer"
                data-testid="resizer"
                onMouseDown={handleResizeStart}
              />
              <div
                className="preview-pane"
                data-testid="preview-pane"
                style={{ flex: 100 - splitRatio }}
              >
                <Preview />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="export-bar">
        <button className="export-btn" onClick={() => setExportDialogOpen(true)}>
          <Download size={14} />
          <span>高级导出</span>
        </button>
        <button className="export-btn" onClick={handleExportHTML}>
          <Download size={14} />
          <span>导出 HTML</span>
        </button>
        <button className="export-btn" onClick={handleExportPDF} data-testid="export-pdf-btn">
          <FileText size={14} />
          <span>导出 PDF</span>
        </button>
      </div>
      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExportWithTemplate}
        onPreview={handlePreviewWithTemplate}
        currentFilename={currentFile?.name}
      />
      <StatusBar />
    </div>
  );
}