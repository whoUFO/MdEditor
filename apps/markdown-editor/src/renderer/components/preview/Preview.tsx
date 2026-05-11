import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useDebounce } from '../../hooks/useDebounce';
import { renderMarkdown } from '../../utils/markdown';
import './Preview.css';

export function Preview(): React.JSX.Element {
  const { content } = useEditorStore();
  const debouncedContent = useDebounce(content, 300);
  const [html, setHtml] = useState('');

  useEffect(() => {
    renderMarkdown(debouncedContent).then(setHtml);
  }, [debouncedContent]);

  return (
    <div 
      className="preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
