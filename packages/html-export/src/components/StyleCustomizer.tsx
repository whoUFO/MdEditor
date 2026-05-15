import React from 'react';
import { TemplateOptions } from '../types';

interface StyleCustomizerProps {
  options: TemplateOptions;
  onChange: (key: keyof TemplateOptions, value: unknown) => void;
}

export const StyleCustomizer: React.FC<StyleCustomizerProps> = ({ options, onChange }) => {
  return (
    <div className="style-customizer">
      <div className="customizer-section">
        <h3 className="section-title">主题</h3>
        <div className="theme-selector">
          <button
            className={`theme-btn ${options.theme === 'light' ? 'active' : ''}`}
            onClick={() => onChange('theme', 'light')}
          >
            ☀️ 浅色
          </button>
          <button
            className={`theme-btn ${options.theme === 'dark' ? 'active' : ''}`}
            onClick={() => onChange('theme', 'dark')}
          >
            🌙 深色
          </button>
          <button
            className={`theme-btn ${options.theme === 'custom' ? 'active' : ''}`}
            onClick={() => onChange('theme', 'custom')}
          >
            🎨 自定义
          </button>
        </div>
      </div>

      <div className="customizer-section">
        <h3 className="section-title">字体</h3>
        <div className="form-group">
          <label>字体族</label>
          <select
            value={options.fontFamily}
            onChange={(e) => onChange('fontFamily', e.target.value)}
          >
            <option value="system-ui, -apple-system, sans-serif">System UI</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>字体大小</label>
            <input
              type="number"
              value={options.fontSize}
              onChange={(e) => onChange('fontSize', parseInt(e.target.value))}
              min="10"
              max="32"
            />
          </div>

          <div className="form-group">
            <label>行高</label>
            <input
              type="number"
              value={options.lineHeight}
              onChange={(e) => onChange('lineHeight', parseFloat(e.target.value))}
              step="0.1"
              min="1"
              max="3"
            />
          </div>
        </div>
      </div>

      <div className="customizer-section">
        <h3 className="section-title">布局</h3>
        <div className="form-group">
          <label>最大宽度</label>
          <input
            type="text"
            value={options.maxWidth}
            onChange={(e) => onChange('maxWidth', e.target.value)}
            placeholder="800px"
          />
        </div>
      </div>

      <div className="customizer-section">
        <h3 className="section-title">功能</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.showTOC}
              onChange={(e) => onChange('showTOC', e.target.checked)}
            />
            <span>显示目录</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.showPageNumbers}
              onChange={(e) => onChange('showPageNumbers', e.target.checked)}
            />
            <span>显示页码</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.printOptimized}
              onChange={(e) => onChange('printOptimized', e.target.checked)}
            />
            <span>打印优化</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.mathEnabled}
              onChange={(e) => onChange('mathEnabled', e.target.checked)}
            />
            <span>启用数学公式</span>
          </label>
        </div>
      </div>

      <div className="customizer-section">
        <h3 className="section-title">代码高亮</h3>
        <div className="form-group">
          <select
            value={options.highlightTheme}
            onChange={(e) => onChange('highlightTheme', e.target.value)}
          >
            <option value="github">GitHub</option>
            <option value="monokai">Monokai</option>
            <option value="dracula">Dracula</option>
            <option value="nord">Nord</option>
            <option value="solarized">Solarized</option>
          </select>
        </div>
      </div>

      {options.theme === 'custom' && (
        <div className="customizer-section">
          <h3 className="section-title">自定义 CSS</h3>
          <div className="form-group">
            <textarea
              value={options.customCSS || ''}
              onChange={(e) => onChange('customCSS', e.target.value)}
              placeholder="输入自定义 CSS..."
              rows={6}
            />
          </div>
        </div>
      )}

      <style>{`
        .style-customizer {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .customizer-section {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 1rem;
          color: #1f2937;
        }

        .theme-selector {
          display: flex;
          gap: 0.5rem;
        }

        .theme-btn {
          flex: 1;
          padding: 0.75rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-btn:hover {
          border-color: #3b82f6;
        }

        .theme-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #3b82f6;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group textarea {
          font-family: 'SFMono-Regular', Consolas, monospace;
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
