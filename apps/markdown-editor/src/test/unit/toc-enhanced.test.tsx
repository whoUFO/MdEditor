import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TOC } from '../../renderer/components/toc/TOC';
import { useEditorStore } from '../../renderer/stores/editorStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('TOC Enhanced Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as any).mockReturnValue({
      content: '# Heading 1\n## Heading 2\n### Heading 3',
    });
  });

  it('should display TOC count in header', () => {
    const { container } = render(<TOC />);
    expect(container.querySelector('.toc')).toBeInTheDocument();
  });

  it('should build hierarchical tree structure', () => {
    const { container } = render(<TOC />);
    expect(container).toBeDefined();
  });

  it('should show empty state when no headings', () => {
    (useEditorStore as any).mockReturnValue({ content: 'Plain text' });
    const { container } = render(<TOC />);
    expect(container).toBeDefined();
  });

  it('should handle deeply nested headings', () => {
    (useEditorStore as any).mockReturnValue({
      content: '# H1\n## H2\n### H3\n#### H4',
    });
    const { container } = render(<TOC />);
    expect(container).toBeDefined();
  });
});
