import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from '../../renderer/components/layout/Toolbar';
import { useEditorStore } from '../../renderer/stores/editorStore';
import { useUIStore } from '../../renderer/stores/uiStore';

vi.mock('../../renderer/stores/editorStore', () => ({
  useEditorStore: vi.fn(),
}));

vi.mock('../../renderer/stores/uiStore', () => ({
  useUIStore: vi.fn(),
}));

describe('Toolbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditorStore as any).mockReturnValue({
      content: '',
      setContent: vi.fn(),
      insertText: vi.fn(),
    });
    (useUIStore as any).mockReturnValue({
      previewVisible: true,
      togglePreview: vi.fn(),
    });
  });

  it('should render toolbar container', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should display all format buttons', () => {
    render(<Toolbar />);
    
    expect(screen.getByTestId('bold-btn')).toBeInTheDocument();
    expect(screen.getByTestId('italic-btn')).toBeInTheDocument();
    expect(screen.getByTestId('heading-btn')).toBeInTheDocument();
    expect(screen.getByTestId('code-btn')).toBeInTheDocument();
    expect(screen.getByTestId('link-btn')).toBeInTheDocument();
    expect(screen.getByTestId('image-btn')).toBeInTheDocument();
    expect(screen.getByTestId('quote-btn')).toBeInTheDocument();
    expect(screen.getByTestId('list-btn')).toBeInTheDocument();
    expect(screen.getByTestId('ordered-list-btn')).toBeInTheDocument();
  });

  it('should have preview toggle button', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('preview-btn')).toBeInTheDocument();
  });

  it('should have export button', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('export-btn')).toBeInTheDocument();
  });

  it('should call insertText when bold button is clicked', () => {
    const insertText = vi.fn();
    (useEditorStore as any).mockReturnValue({
      content: '',
      setContent: vi.fn(),
      insertText,
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByTestId('bold-btn'));
    
    expect(insertText).toHaveBeenCalledWith('**', '**');
  });

  it('should call insertText when italic button is clicked', () => {
    const insertText = vi.fn();
    (useEditorStore as any).mockReturnValue({
      content: '',
      setContent: vi.fn(),
      insertText,
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByTestId('italic-btn'));
    
    expect(insertText).toHaveBeenCalledWith('*', '*');
  });

  it('should call togglePreview when preview button is clicked', () => {
    const togglePreview = vi.fn();
    (useUIStore as any).mockReturnValue({
      previewVisible: true,
      togglePreview,
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByTestId('preview-btn'));
    
    expect(togglePreview).toHaveBeenCalled();
  });

  it('should have correct button labels', () => {
    render(<Toolbar />);
    
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('I')).toBeInTheDocument();
  });
});
