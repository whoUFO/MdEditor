import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Editor } from '../editor/Editor';
import { Preview } from '../preview/Preview';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { FileTree } from '../file-tree/FileTree';
import { TOC } from '../toc/TOC';
import { RecentFiles } from '../recent-files/RecentFiles';
import { useUIStore } from '../../stores/uiStore';
import { useFileStore } from '../../stores/fileStore';
import { useEditorStore } from '../../stores/editorStore';
import { renderMarkdown } from '../../utils/markdown';
import { FolderOpen, BookOpen, FileText, Download, Clock } from 'lucide-react';
import './MainLayout.css';

type SidebarTab = 'files' | 'toc' | 'recent';

interface MainLayoutProps {
  onOpenSettings: () => void;
}

export function MainLayout({ onOpenSettings }: MainLayoutProps): React.JSX.Element {
  const { previewVisible, splitRatio, sidebarVisible, toggleSidebar, setSplitRatio } = useUIStore();
  const { currentFile, saveFile } = useFileStore();
  const { content } = useEditorStore();
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('files');
  
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

  const handleExportHTML = async () => {
    const html = await renderMarkdown(content);
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentFile?.name || 'Document'}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <style>
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
    const html = await renderMarkdown(content);
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentFile?.name || 'Document'}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 { 
      margin-top: 1.5em; 
      margin-bottom: 0.5em; 
      font-weight: 600;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1em; }
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
      await window.electronAPI.exportToPDF(fullHTML, currentFile?.name || 'document');
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(fullHTML);
        printWindow.document.close();
        printWindow.print();
      }
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
        <button className="export-btn" onClick={handleExportHTML}>
          <Download size={14} />
          <span>导出 HTML</span>
        </button>
        <button className="export-btn" onClick={handleExportPDF}>
          <FileText size={14} />
          <span>导出 PDF</span>
        </button>
      </div>
      <StatusBar />
    </div>
  );
}