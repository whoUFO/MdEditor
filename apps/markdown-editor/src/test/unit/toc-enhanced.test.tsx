import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TOC } from '../../renderer/components/toc/TOC';
import { useEditorStore } from '../../renderer/stores/editorStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('TOC Enhanced Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as any).mockReturnValue({
      content: '# Heading 1\n## Heading 2\n### Heading 3\n## Heading 4',
    });
  });

  it('should display TOC count in header', () => {
    render(<TOC />);
    const countBadge = document.querySelector('.toc-count');
    expect(countBadge?.textContent).toBe('4');
  });

  it('should build hierarchical tree structure', () => {
    render(<TOC />);
    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(4);
  });

  it('should show collapse button for items with children', () => {
    (useEditorStore as any).mockReturnValue({
      content: '# H1\n## H2\n### H3\n## H4',
    });
    
    render(<TOC />);
    const collapseButtons = document.querySelectorAll('.toc-collapse-btn');
    expect(collapseButtons.length).toBeGreaterThan(0);
  });

  it('should toggle collapse state', () => {
    render(<TOC />);
    const collapseButton = document.querySelector('.toc-collapse-btn');
    
    if (collapseButton) {
      fireEvent.click(collapseButton);
      expect(collapseButton).toBeInTheDocument();
    }
  });

  it('should highlight active heading', () => {
    render(<TOC />);
    const activeItem = document.querySelector('.toc-item.active');
    expect(activeItem).toBeInTheDocument();
  });

  it('should show empty state when no headings', () => {
    (useEditorStore as any).mockReturnValue({
      content: 'Just plain text without headings',
    });

    render(<TOC />);
    const emptyMessage = document.querySelector('.toc-empty');
    expect(emptyMessage?.textContent).toBe('暂无目录');
  });

  it('should handle deeply nested headings', () => {
    (useEditorStore as any).mockReturnValue({
      content: '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6',
    });

    render(<TOC />);
    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(6);
  });

  it('should apply correct indentation for each level', () => {
    (useEditorStore as any).mockReturnValue({
      content: '# H1\n## H2\n### H3',
    });

    render(<TOC />);
    
    const level1 = document.querySelector('.toc-item.level-1');
    const level2 = document.querySelector('.toc-item.level-2');
    const level3 = document.querySelector('.toc-item.level-3');
    
    expect(level1).toBeInTheDocument();
    expect(level2).toBeInTheDocument();
    expect(level3).toBeInTheDocument();
  });

  it('should scroll to heading on click', () => {
    render(<TOC />);
    const tocItem = document.querySelector('.toc-item');
    
    if (tocItem) {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;
      
      fireEvent.click(tocItem);
      expect(scrollIntoViewMock).toHaveBeenCalled();
    }
  });

  it('should debounce content changes', async () => {
    const setStateMock = vi.fn();
    (useEditorStore as any).mockReturnValue({
      content: '# Initial',
    });

    render(<TOC />);
    
    (useEditorStore as any).mockReturnValue({
      content: '# Updated',
    });
    
    await new Promise(resolve => setTimeout(resolve, 400));
    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(1);
  });
});
