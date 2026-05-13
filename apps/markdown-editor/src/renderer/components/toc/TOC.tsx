import React, { useEffect, useState, useCallback } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { useDebounce } from '../../hooks/useDebounce';
import { parseToc } from '../../utils/markdown';
import './TOC.css';

interface TocItem {
  level: number;
  text: string;
  id: string;
  line: number;
}

interface TocGroup {
  level: number;
  text: string;
  id: string;
  line: number;
  children: TocGroup[];
  expanded: boolean;
}

export function TOC(): React.JSX.Element {
  const { content } = useEditorStore();
  const debouncedContent = useDebounce(content, 300);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const parsed = parseToc(debouncedContent);
    setToc(parsed);
    if (parsed.length > 0 && !activeId) {
      setActiveId(parsed[0].id);
    }
  }, [debouncedContent]);

  useEffect(() => {
    const handleScroll = () => {
      const previewContent = document.querySelector('.preview-content');
      if (!previewContent) return;

      const headings = previewContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const scrollTop = previewContent.scrollTop;

      let currentHeading: Element | null = null;
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const containerRect = previewContent.getBoundingClientRect();
        if (rect.top - containerRect.top <= 100) {
          currentHeading = heading;
        }
      });

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    const previewContent = document.querySelector('.preview-content');
    previewContent?.addEventListener('scroll', handleScroll);
    return () => previewContent?.removeEventListener('scroll', handleScroll);
  }, []);

  const buildTocTree = useCallback((items: TocItem[]): TocGroup[] => {
    const root: TocGroup[] = [];
    const stack: TocGroup[] = [];

    items.forEach((item) => {
      const group: TocGroup = {
        ...item,
        children: [],
        expanded: !collapsedGroups.has(item.id),
      };

      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(group);
      } else {
        stack[stack.length - 1].children.push(group);
      }

      stack.push(group);
    });

    return root;
  }, [collapsedGroups]);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleItemClick = useCallback((id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const previewContent = document.querySelector('.preview-content');
      if (previewContent) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  const renderTocGroup = (group: TocGroup, depth: number = 0) => {
    const hasChildren = group.children.length > 0;
    const isExpanded = !collapsedGroups.has(group.id);

    return (
      <div key={group.id} className="toc-group" style={{ marginLeft: depth * 12 }}>
        <div
          className={`toc-item level-${group.level} ${activeId === group.id ? 'active' : ''}`}
          onClick={() => handleItemClick(group.id)}
        >
          {hasChildren && (
            <button
              className="toc-collapse-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(group.id);
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          {!hasChildren && <span className="toc-indent" />}
          <span className="toc-text">{group.text}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="toc-children">
            {group.children.map((child) => renderTocGroup(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tocTree = buildTocTree(toc);

  return (
    <div className="toc">
      <div className="toc-header">
        <span>目录</span>
        <span className="toc-count">{toc.length}</span>
      </div>
      <div className="toc-content">
        {toc.length === 0 ? (
          <div className="toc-empty">暂无目录</div>
        ) : (
          tocTree.map((group) => renderTocGroup(group))
        )}
      </div>
    </div>
  );
}
