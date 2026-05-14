import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
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
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '',
      setContent: vi.fn(),
      insertText: vi.fn(),
      getSelectedText: vi.fn().mockReturnValue(''),
    });
    (useUIStore as unknown as Mock).mockReturnValue({
      previewVisible: true,
      togglePreview: vi.fn(),
      theme: 'light',
      toggleTheme: vi.fn(),
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

  it('should have theme toggle button', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('theme-btn')).toBeInTheDocument();
  });

  it('should call insertText when bold button is clicked', () => {
    const insertText = vi.fn();
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '',
      setContent: vi.fn(),
      insertText,
      getSelectedText: vi.fn().mockReturnValue(''),
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByTestId('bold-btn'));

    expect(insertText).toHaveBeenCalledWith('**粗体文本**');
  });

  it('should call insertText when italic button is clicked', () => {
    const insertText = vi.fn();
    (useEditorStore as unknown as Mock).mockReturnValue({
      content: '',
      setContent: vi.fn(),
      insertText,
      getSelectedText: vi.fn().mockReturnValue(''),
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByTestId('italic-btn'));

    expect(insertText).toHaveBeenCalledWith('*斜体文本*');
  });

  it('should call togglePreview when preview button is clicked', () => {
    const togglePreview = vi.fn();
    (useUIStore as unknown as Mock).mockReturnValue({
      previewVisible: true,
      togglePreview,
      theme: 'light',
      toggleTheme: vi.fn(),
    });

    render(<Toolbar />);
    fireEvent.click(screen.getByTestId('preview-btn'));

    expect(togglePreview).toHaveBeenCalled();
  });
});