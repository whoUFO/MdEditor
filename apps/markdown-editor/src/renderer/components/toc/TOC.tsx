import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useDebounce } from '../../hooks/useDebounce';
import { parseToc } from '../../utils/markdown';
import './TOC.css';

interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function TOC(): React.JSX.Element {
  const { content } = useEditorStore();
  const debouncedContent = useDebounce(content, 300);
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const parsed = parseToc(debouncedContent);
    setToc(parsed);
  }, [debouncedContent]);

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="toc">
      <div className="toc-header">
        <span>目录</span>
      </div>
      <div className="toc-content">
        {toc.length === 0 ? (
          <div className="toc-empty">暂无目录</div>
        ) : (
          toc.map((item) => (
            <div
              key={item.id}
              className={`toc-item level-${item.level}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="toc-text">{item.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
