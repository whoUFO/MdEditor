import React, { useState } from 'react';
import { Download, X, FileText, Layout, BookOpen, File } from 'lucide-react';
import { ALL_TEMPLATES } from '@markdown-editor/html-export';
import type { ExportConfig } from '@markdown-editor/html-export';
import { useSettingsStore } from '../../stores/settingsStore';
import './ExportDialog.css';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  onPreview: (html: string) => void;
  currentFilename?: string;
}

const templateIcons: Record<string, React.ReactNode> = {
  default: <File size={20} />,
  minimal: <FileText size={20} />,
  documentation: <BookOpen size={20} />,
  blog: <Layout size={20} />,
  print: <FileText size={20} />,
};

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  onPreview,
  currentFilename,
}: ExportDialogProps): React.JSX.Element | null {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showTOC, setShowTOC] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  
  const settings = useSettingsStore();

  if (!isOpen) return null;

  const handleExport = () => {
    const config: ExportConfig = {
      templateId: selectedTemplate,
      options: {
        theme,
        showTOC,
        fontSize,
        lineHeight,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '900px',
        showPageNumbers: false,
        printOptimized: selectedTemplate === 'print',
        highlightTheme: 'github',
        mathEnabled: true,
        pageSettings: settings.exportPageSettings,
      },
      variables: {
        title: currentFilename?.replace(/\.md$/, '') || 'Untitled',
        author: '',
        date: new Date().toLocaleDateString('zh-CN'),
        content: '',
        toc: '',
        style: '',
      },
    };
    onExport(config);
    onClose();
  };

  const handlePreview = () => {
    const config: ExportConfig = {
      templateId: selectedTemplate,
      options: {
        theme,
        showTOC,
        fontSize,
        lineHeight,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '900px',
        showPageNumbers: false,
        printOptimized: selectedTemplate === 'print',
        highlightTheme: 'github',
        mathEnabled: true,
        pageSettings: settings.exportPageSettings,
      },
    };
    onPreview(selectedTemplate);
  };

  return (
    <div className="export-dialog-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-dialog-header">
          <h2>导出 HTML</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="export-dialog-content">
          <div className="export-section">
            <h3>选择模板</h3>
            <div className="template-grid">
              {ALL_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="template-icon">
                    {templateIcons[template.id] || <File size={20} />}
                  </div>
                  <div className="template-info">
                    <span className="template-name">{template.name}</span>
                    <span className="template-desc">{template.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="export-section">
            <h3>样式设置</h3>
            <div className="style-options">
              <div className="option-row">
                <label>主题</label>
                <div className="button-group">
                  <button
                    className={`option-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    明亮
                  </button>
                  <button
                    className={`option-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    暗黑
                  </button>
                </div>
              </div>

              <div className="option-row">
                <label>显示目录</label>
                <input
                  type="checkbox"
                  checked={showTOC}
                  onChange={(e) => setShowTOC(e.target.checked)}
                />
              </div>

              <div className="option-row">
                <label>字号: {fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </div>

              <div className="option-row">
                <label>行高: {lineHeight}</label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="export-dialog-footer">
          <button className="preview-btn" onClick={handlePreview}>
            预览
          </button>
          <button className="export-btn primary" onClick={handleExport}>
            <Download size={16} />
            导出 HTML
          </button>
        </div>
      </div>
    </div>
  );
}
