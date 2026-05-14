import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useUIStore } from '../../stores/uiStore';
import { useDebounce } from '../../hooks/useDebounce';
import { renderMarkdown } from '../../utils/markdown';
import { setEditorScrollHandler } from '../editor/Editor';
import './Preview.css';

export function Preview(): React.JSX.Element {
  const { content } = useEditorStore();
  const { syncScroll } = useUIStore();
  const debouncedContent = useDebounce(content, 300);
  const [html, setHtml] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    renderMarkdown(debouncedContent).then(setHtml);
  }, [debouncedContent]);

  useEffect(() => {
    const previewEl = previewRef.current;
    if (!previewEl) return;

    const handleEditorScroll = (percent: number) => {
      if (!isSyncingRef.current && syncScroll) {
        const scrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
        previewEl.scrollTop = percent * scrollHeight;
      }
    };

    setEditorScrollHandler(handleEditorScroll);

    const handleScroll = () => {
      if (!isSyncingRef.current && window.syncEditorScroll && syncScroll) {
        isSyncingRef.current = true;
        const scrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
        const scrollPercent = scrollHeight > 0 ? previewEl.scrollTop / scrollHeight : 0;
        window.syncEditorScroll(scrollPercent);
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 50);
      }
    };

    previewEl.addEventListener('scroll', handleScroll);

    return () => {
      previewEl.removeEventListener('scroll', handleScroll);
      setEditorScrollHandler(() => {});
    };
  }, [syncScroll]);

  return (
    <div className="preview-container" data-testid="preview-container">
      <div 
        ref={previewRef}
        className="preview-scroll"
        dangerouslySetInnerHTML={{ __html: `<div class="preview-content">${html}</div>` }}
      />
    </div>
  );
}