import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TOC } from '../../renderer/components/toc/TOC';
import { useEditorStore } from '../../renderer/stores/editorStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('TOC Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as unknown as Mock).mockReturnValue({
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

    const h1Items = document.querySelectorAll('.toc-item.level-1');
    const h2Items = document.querySelectorAll('.toc-item.level-2');
    const h3Items = document.querySelectorAll('.toc-item.level-3');

    expect(h1Items.length).toBe(1);
    expect(h2Items.length).toBe(1);
    expect(h3Items.length).toBe(1);
  });

  it('should render headings as clickable', () => {
    render(<TOC />);

    const heading = screen.getByText('Heading 1');
    expect(heading).toBeDefined();
    fireEvent.click(heading);
  });

  it('should handle empty content', () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '',
    });

    render(<TOC />);

    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(0);
  });

  it('should handle content without headings', () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: 'Just some plain text without any headings.',
    });

    render(<TOC />);

    const tocItems = document.querySelectorAll('.toc-item');
    expect(tocItems.length).toBe(0);
  });
});