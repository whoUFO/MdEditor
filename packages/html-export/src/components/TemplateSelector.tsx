import React, { useState } from 'react';
import { ExportTemplate } from '../types';

interface TemplateSelectorProps {
  templates: ExportTemplate[];
  selectedId: string;
  onSelect: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedId,
  onSelect,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="template-selector">
      <h3 className="template-selector-title">选择模板</h3>
      <div className="template-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedId === template.id ? 'selected' : ''}`}
            onClick={() => onSelect(template.id)}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(template.id);
              }
            }}
            aria-selected={selectedId === template.id}
          >
            <div className="template-thumbnail">
              {template.thumbnail ? (
                <img src={template.thumbnail} alt={template.name} />
              ) : (
                <div className="template-placeholder">
                  <span className="template-icon">📄</span>
                </div>
              )}
            </div>
            <div className="template-info">
              <h4 className="template-name">{template.name}</h4>
              <p className="template-description">{template.description}</p>
            </div>
            {selectedId === template.id && (
              <div className="template-checkmark">✓</div>
            )}
          </div>
        ))}
      </div>

      {hoveredId && (
        <div className="template-tooltip">
          {templates.find((t) => t.id === hoveredId)?.description}
        </div>
      )}

      <style>{`
        .template-selector {
          margin-bottom: 1.5rem;
        }

        .template-selector-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .template-card {
          position: relative;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .template-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
        }

        .template-card.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .template-thumbnail {
          width: 100%;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .template-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .template-placeholder {
          font-size: 3rem;
        }

        .template-info {
          text-align: left;
        }

        .template-name {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          color: #1f2937;
        }

        .template-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .template-checkmark {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }

        .template-tooltip {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};
