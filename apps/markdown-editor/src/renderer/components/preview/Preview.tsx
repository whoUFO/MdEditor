import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useDebounce } from '../../hooks/useDebounce';
import { renderMarkdown } from '../../utils/markdown';
import { setEditorScrollHandler } from '../editor/Editor';
import './Preview.css';

export function Preview(): React.JSX.Element {
  const { content } = useEditorStore();
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

    setEditorScrollHandler((percent: number) => {
      isSyncingRef.current = true;
      const scrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
      previewEl.scrollTop = percent * scrollHeight;
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 50);
    });

    const handleScroll = () => {
      if (!isSyncingRef.current && window.syncEditorScroll) {
        const scrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
        const scrollPercent = scrollHeight > 0 ? previewEl.scrollTop / scrollHeight : 0;
        window.syncEditorScroll(scrollPercent);
      }
    };

    previewEl.addEventListener('scroll', handleScroll);

    return () => {
      previewEl.removeEventListener('scroll', handleScroll);
      setEditorScrollHandler(() => {});
    };
  }, []);

  return (
    <div
      ref={previewRef}
      className="preview"
      data-testid="preview-container"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}