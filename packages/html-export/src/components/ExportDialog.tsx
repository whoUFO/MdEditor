import React, { useState, useEffect } from 'react';
import { ExportTemplate, TemplateOptions, ExportConfig } from '../types';
import { TemplateSelector } from './TemplateSelector';
import { StyleCustomizer } from './StyleCustomizer';

interface ExportDialogProps {
  templates: ExportTemplate[];
  initialTemplateId?: string;
  initialHtml?: string;
  onExport: (html: string, filename: string) => void;
  onPreview?: (html: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  templates,
  initialTemplateId = 'default',
  initialHtml = '',
  onExport,
  onPreview,
  onClose,
  isOpen = true,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [options, setOptions] = useState<TemplateOptions>(() => {
    const template = templates.find((t) => t.id === initialTemplateId);
    return template?.defaultOptions || {
      theme: 'light',
      fontFamily: 'system-ui',
      fontSize: 16,
      lineHeight: 1.6,
      maxWidth: '800px',
      showTOC: true,
      showPageNumbers: false,
      printOptimized: false,
      highlightTheme: 'github',
      mathEnabled: false,
    };
  });
  const [variables, setVariables] = useState({
    title: '',
    author: '',
  });
  const [filename, setFilename] = useState('document.html');
  const [activeTab, setActiveTab] = useState<'template' | 'style'>('template');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      setOptions(template.defaultOptions);
    }
  }, [selectedTemplateId, templates]);

  const handleOptionChange = (key: keyof TemplateOptions, value: unknown) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      if (!initialHtml) {
        throw new Error('No HTML content to export');
      }

      const config: ExportConfig = {
        templateId: selectedTemplateId,
        options,
        variables: {
          title: variables.title || 'Untitled',
          author: variables.author,
        },
      };

      const { HTMLExporter } = await import('../exporter');
      const exporter = new HTMLExporter(templates);
      const result = await exporter.export(initialHtml, config);

      if (!result.success || !result.html) {
        throw new Error(result.error || 'Export failed');
      }

      const exportFilename = filename.endsWith('.html') ? filename : `${filename}.html`;
      onExport(result.html, exportFilename);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async () => {
    if (!initialHtml) return;

    try {
      const config: ExportConfig = {
        templateId: selectedTemplateId,
        options,
        variables: {
          title: variables.title || 'Untitled',
          author: variables.author,
        },
      };

      const { HTMLExporter } = await import('../exporter');
      const exporter = new HTMLExporter(templates);
      const result = await exporter.export(initialHtml, config);

      if (result.success && result.html) {
        onPreview?.(result.html);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="export-dialog-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-dialog-header">
          <h2 className="export-dialog-title">导出 HTML</h2>
          <button className="export-dialog-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="export-dialog-tabs">
          <button
            className={`tab ${activeTab === 'template' ? 'active' : ''}`}
            onClick={() => setActiveTab('template')}
          >
            模板
          </button>
          <button
            className={`tab ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            样式
          </button>
        </div>

        <div className="export-dialog-content">
          {error && (
            <div className="export-error">
              {error}
            </div>
          )}

          {activeTab === 'template' && (
            <>
              <TemplateSelector
                templates={templates}
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
              />

              <div className="export-form">
                <div className="form-group">
                  <label htmlFor="export-title">文档标题</label>
                  <input
                    id="export-title"
                    type="text"
                    value={variables.title}
                    onChange={(e) => handleVariableChange('title', e.target.value)}
                    placeholder="输入文档标题"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="export-author">作者</label>
                  <input
                    id="export-author"
                    type="text"
                    value={variables.author}
                    onChange={(e) => handleVariableChange('author', e.target.value)}
                    placeholder="输入作者名称（可选）"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="export-filename">文件名</label>
                  <input
                    id="export-filename"
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="document.html"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'style' && (
            <StyleCustomizer
              options={options}
              onChange={handleOptionChange}
            />
          )}
        </div>

        <div className="export-dialog-footer">
          <button
            className="btn btn-secondary"
            onClick={handlePreview}
            disabled={!initialHtml}
          >
            预览
          </button>
          <div className="footer-right">
            <button className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={isExporting || !initialHtml}
            >
              {isExporting ? '导出中...' : '导出'}
            </button>
          </div>
        </div>

        <style>{`
          .export-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .export-dialog {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .export-dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .export-dialog-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
          }

          .export-dialog-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
          }

          .export-dialog-close:hover {
            background: #f3f4f6;
            color: #1f2937;
          }

          .export-dialog-tabs {
            display: flex;
            border-bottom: 1px solid #e5e7eb;
            padding: 0 1.5rem;
          }

          .tab {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
          }

          .tab.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
          }

          .tab:hover:not(.active) {
            color: #1f2937;
          }

          .export-dialog-content {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
          }

          .export-error {
            background: #fef2f2;
            color: #991b1b;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          }

          .export-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-group label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }

          .form-group input {
            padding: 0.625rem 0.875rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
          }

          .form-group input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .export-dialog-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
            border-radius: 0 0 12px 12px;
          }

          .footer-right {
            display: flex;
            gap: 0.75rem;
          }

          .btn {
            padding: 0.625rem 1.25rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-primary {
            background: #3b82f6;
            color: white;
            border: none;
          }

          .btn-primary:hover:not(:disabled) {
            background: #2563eb;
          }

          .btn-primary:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }

          .btn-secondary {
            background: white;
            color: #374151;
            border: 1px solid #d1d5db;
          }

          .btn-secondary:hover:not(:disabled) {
            background: #f3f4f6;
          }

          .btn-secondary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
};
