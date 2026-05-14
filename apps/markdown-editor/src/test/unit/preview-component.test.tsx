import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Preview } from '../../renderer/components/preview/Preview';
import { useEditorStore } from '../../renderer/stores/editorStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

describe('Preview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '',
    });
  });

  it('should render preview container', () => {
    render(<Preview />);
    expect(screen.getByTestId('preview-container')).toBeInTheDocument();
  });

  it('should display preview content area', () => {
    render(<Preview />);
    expect(document.querySelector('.preview-content')).toBeInTheDocument();
  });

  it('should render heading elements', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '# Heading 1\n## Heading 2\n### Heading 3',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    const h3 = document.querySelector('h3');
    
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
    expect(h3).toBeInTheDocument();
  });

  it('should render bold text', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '**bold text**',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(document.querySelector('strong')).toBeInTheDocument();
    expect(document.querySelector('strong')?.textContent).toBe('bold text');
  });

  it('should render italic text', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '*italic text*',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(document.querySelector('em')).toBeInTheDocument();
    expect(document.querySelector('em')?.textContent).toBe('italic text');
  });

  it('should render code blocks', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '```javascript\nconst x = 1;\n```',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(document.querySelector('pre code')).toBeInTheDocument();
  });

  it('should render lists', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '- Item 1\n- Item 2\n- Item 3',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const listItems = document.querySelectorAll('ul li');
    expect(listItems.length).toBe(3);
  });

  it('should render blockquotes', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '> This is a quote',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(document.querySelector('blockquote')).toBeInTheDocument();
  });

  it('should render links', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '[Link Text](https://example.com)',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const link = document.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.textContent).toBe('Link Text');
    expect(link?.getAttribute('href')).toBe('https://example.com');
  });

  it('should render horizontal rules', async () => {
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '---',
    });

    render(<Preview />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(document.querySelector('hr')).toBeInTheDocument();
  });
});
