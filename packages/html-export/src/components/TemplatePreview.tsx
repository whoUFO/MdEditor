import React, { useEffect, useRef } from 'react';

interface TemplatePreviewProps {
  html: string;
  title?: string;
  width?: string;
  height?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  html,
  title = 'Preview',
  width = '100%',
  height = '600px',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && html) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <div className="template-preview">
      <div className="preview-header">
        <span className="preview-title">{title}</span>
      </div>
      <div className="preview-container">
        <iframe
          ref={iframeRef}
          title={title}
          width={width}
          height={height}
          className="preview-iframe"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <style>{`
        .template-preview {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: #f9fafb;
        }

        .preview-header {
          padding: 0.75rem 1rem;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .preview-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .preview-container {
          background: white;
          overflow: auto;
        }

        .preview-iframe {
          border: none;
          display: block;
          width: 100%;
          height: ${height};
        }
      `}</style>
    </div>
  );
};
