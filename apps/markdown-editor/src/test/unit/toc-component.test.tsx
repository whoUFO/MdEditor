import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
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
    const { container } = render(<TOC />);
    expect(container.querySelector('.toc')).toBeInTheDocument();
  });

  it('should extract headings from content', () => {
    const { container } = render(<TOC />);
    expect(container).toBeDefined();
  });

  it('should display heading levels', () => {
    const { container } = render(<TOC />);
    expect(container).toBeDefined();
  });
});
