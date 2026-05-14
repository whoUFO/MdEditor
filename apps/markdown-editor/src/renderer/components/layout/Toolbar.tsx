import React from 'react';
import { FolderOpen, Save, Eye, EyeOff, Sun, Moon, Bold, Italic, Code, Heading1, List, ListOrdered, Quote, Code2, Link, Image, Minus, PanelLeft, PanelLeftClose, ArrowDownUp, Settings } from 'lucide-react';
import { useFileStore } from '../../stores/fileStore';
import { useUIStore } from '../../stores/uiStore';
import { useEditorStore } from '../../stores/editorStore';
import './Toolbar.css';

const formatButtons = [
  { icon: Bold, action: 'bold', label: '粗体', shortcut: 'Ctrl+B' },
  { icon: Italic, action: 'italic', label: '斜体', shortcut: 'Ctrl+I' },
  { icon: Code, action: 'code', label: '行内代码', shortcut: 'Ctrl+K' },
  { icon: Heading1, action: 'h1', label: '标题1', shortcut: 'Ctrl+1' },
  { icon: List, action: 'list', label: '无序列表', shortcut: 'Ctrl+Shift+U' },
  { icon: ListOrdered, action: 'orderedList', label: '有序列表', shortcut: 'Ctrl+Shift+O' },
  { icon: Quote, action: 'quote', label: '引用', shortcut: 'Ctrl+Shift+]' },
  { icon: Code2, action: 'codeBlock', label: '代码块', shortcut: 'Ctrl+Shift+K' },
  { icon: Link, action: 'link', label: '链接', shortcut: 'Ctrl+L' },
  { icon: Image, action: 'image', label: '图片', shortcut: 'Ctrl+Shift+I' },
  { icon: Minus, action: 'hr', label: '分割线', shortcut: 'Ctrl+Shift+H' },
];

interface ToolbarProps {
  onOpenSettings: () => void;
}

export function Toolbar({ onOpenSettings }: ToolbarProps): React.JSX.Element {
  const { openFile, saveFile, saveAsFile } = useFileStore();
  const { previewVisible, togglePreview, theme, toggleTheme, sidebarVisible, toggleSidebar, syncScroll, toggleSyncScroll } = useUIStore();
  const { insertText, getSelectedText } = useEditorStore();

  const handleFormatAction = (action: string) => {
    const selectedText = getSelectedText();

    switch (action) {
      case 'bold':
        insertText(`**${selectedText || '粗体文本'}**`);
        break;
      case 'italic':
        insertText(`*${selectedText || '斜体文本'}*`);
        break;
      case 'code':
        insertText(`\`${selectedText || 'code'}\``);
        break;
      case 'h1':
        insertText('# ');
        break;
      case 'list':
        insertText('- ');
        break;
      case 'orderedList':
        insertText('1. ');
        break;
      case 'quote':
        insertText('> ');
        break;
      case 'codeBlock':
        insertText('```\n\n```');
        break;
      case 'link':
        insertText(`[${selectedText || '链接文本'}](url)`);
        break;
      case 'image':
        insertText(`![${selectedText || '图片描述'}](image-url)`);
        break;
      case 'hr':
        insertText('\n---\n');
        break;
    }
  };

  return (
    <div className="toolbar" data-testid="toolbar">
      <div className="toolbar-group">
        <button
          onClick={toggleSidebar}
          title={`${sidebarVisible ? '隐藏' : '显示'}侧边栏 (Ctrl+B)`}
          data-testid="sidebar-toggle-btn"
        >
          {sidebarVisible ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
        <button onClick={openFile} title="打开文件 (Ctrl+O)" data-testid="open-btn">
          <FolderOpen size={18} />
        </button>
        <button onClick={saveFile} title="保存 (Ctrl+S)" data-testid="save-btn">
          <Save size={18} />
        </button>
        <button onClick={saveAsFile} title="另存为 (Ctrl+Shift+S)" data-testid="save-as-btn">
          <Save size={18} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={() => handleFormatAction('bold')}
          title="粗体 (Ctrl+B)"
          data-testid="bold-btn"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('italic')}
          title="斜体 (Ctrl+I)"
          data-testid="italic-btn"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('code')}
          title="行内代码 (Ctrl+K)"
          data-testid="code-btn"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('h1')}
          title="标题1 (Ctrl+1)"
          data-testid="heading-btn"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('list')}
          title="无序列表 (Ctrl+Shift+U)"
          data-testid="list-btn"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('orderedList')}
          title="有序列表 (Ctrl+Shift+O)"
          data-testid="ordered-list-btn"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('quote')}
          title="引用 (Ctrl+Shift+])"
          data-testid="quote-btn"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('codeBlock')}
          title="代码块 (Ctrl+Shift+K)"
          data-testid="code-block-btn"
        >
          <Code2 size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('link')}
          title="链接 (Ctrl+L)"
          data-testid="link-btn"
        >
          <Link size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('image')}
          title="图片 (Ctrl+Shift+I)"
          data-testid="image-btn"
        >
          <Image size={18} />
        </button>
        <button
          onClick={() => handleFormatAction('hr')}
          title="分割线 (Ctrl+Shift+H)"
          data-testid="hr-btn"
        >
          <Minus size={18} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={toggleSyncScroll}
          title={`${syncScroll ? '关闭' : '开启'}同步滚动`}
          data-testid="sync-scroll-btn"
          className={syncScroll ? 'active' : ''}
        >
          <ArrowDownUp size={18} />
        </button>
        <button
          onClick={togglePreview}
          title={`${previewVisible ? '隐藏预览' : '显示预览'} (Ctrl+Shift+P)`}
          data-testid="preview-btn"
        >
          {previewVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button
          onClick={toggleTheme}
          title={`切换到${theme === 'light' ? '暗黑' : '明亮'}主题`}
          data-testid="theme-btn"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button
          onClick={onOpenSettings}
          title="设置"
          data-testid="settings-btn"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}