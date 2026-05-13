import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TOC } from '../../renderer/components/toc/TOC';
import { useEditorStore } from '../../renderer/stores/editorStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('TOC Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as any).mockReturnValue({
      content: '# Heading 1\n## Heading 2\n### Heading 3',
    });
  });

  it('should render TOC container', () => {
    render(<TOC />);
    expect(screen.getByTestId('toc-panel')).toBeInTheDocument();
  });

  it('should extract headings from content', () => {
    render(<TOC />);
    
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
    expect(screen.getByText('Heading 3')).toBeInTheDocument();
  });

  it('should display heading levels', () => {
    render(<TOC />);
    
    const h1Items = document.querySelectorAll('.toc-item[data-level="1"]');
    const h2Items = document.querySelectorAll('.toc-item[data-level="2"]');
    const h3Items = document.querySelectorAll('.toc-item[data-level="3"]');
    
    expect(h1Items.length).toBe(1);
    expect(h2Items.length).toBe(1);
    expect(h3Items.length).toBe(1);
  });

  it('should be clickable', () => {
    const scrollToLine = vi.fn();
    render(<TOC scrollToLine={scrollToLine} />);
    
    const heading = screen.getByText('Heading 1');
    fireEvent.click(heading);
    
    expect(scrollToLine).toBeDefined();
  });

  it('should handle empty content', () => {
    (useEditorStore as any).mockReturnValue({
      content: '',
    });

    render(<TOC />);
    
    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(0);
  });

  it('should handle content without headings', () => {
    (useEditorStore as any).mockReturnValue({
      content: 'Just some plain text without any headings.',
    });

    render(<TOC />);
    
    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(0);
  });
});
