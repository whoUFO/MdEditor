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

export function MainLayout(): React.JSX.Element {
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
    if (window.electronAPI) {
      await window.electronAPI.printToPDF();
    } else {
      window.print();
    }
  };

  return (
    <div className="main-layout" data-testid="main-layout">
      <Toolbar />
      <div className="editor-container" ref={containerRef} data-testid="editor-container">
        {sidebarVisible && (
          <div className="sidebar" data-testid="sidebar">
            <div className="sidebar-tabs">
              <button
                className={`sidebar-tab ${sidebarTab === 'files' ? 'active' : ''}`}
                onClick={() => setSidebarTab('files')}
                data-testid="files-tab"
              >
                <FolderOpen size={16} />
                <span>文件</span>
              </button>
              <button
                className={`sidebar-tab ${sidebarTab === 'recent' ? 'active' : ''}`}
                onClick={() => setSidebarTab('recent')}
                data-testid="recent-tab"
              >
                <Clock size={16} />
                <span>最近</span>
              </button>
              <button
                className={`sidebar-tab ${sidebarTab === 'toc' ? 'active' : ''}`}
                onClick={() => setSidebarTab('toc')}
                data-testid="toc-tab"
              >
                <BookOpen size={16} />
                <span>目录</span>
              </button>
            </div>
            <div className="sidebar-content" data-testid="sidebar-content">
              {sidebarTab === 'files' && <FileTree />}
              {sidebarTab === 'recent' && <RecentFiles />}
              {sidebarTab === 'toc' && <TOC />}
            </div>
          </div>
        )}
        
        <div className="editor-main" data-testid="editor-main">
          <div 
            className="editor-pane" 
            style={{ 
              flex: previewVisible ? splitRatio : 1,
              transition: isResizingRef.current ? 'none' : 'flex 0.2s ease'
            }}
            data-testid="editor-pane"
          >
            <Editor />
          </div>
          
          {previewVisible && (
            <>
              <div 
                className="resizer" 
                onMouseDown={handleResizeStart}
                data-testid="resizer"
              />
              <div 
                className="preview-pane" 
                style={{ flex: 100 - splitRatio }}
                data-testid="preview-pane"
              >
                <Preview />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="export-bar" data-testid="export-bar">
        <button className="export-btn" onClick={handleExportHTML} data-testid="export-html-btn">
          <Download size={14} />
          <span>导出 HTML</span>
        </button>
        <button className="export-btn" onClick={handleExportPDF} data-testid="export-pdf-btn">
          <FileText size={14} />
          <span>导出 PDF</span>
        </button>
      </div>
      <StatusBar />
    </div>
  );
}
