import React from 'react';
import { FileOpen, FileSave, Eye, EyeOff, Sun, Moon, Bold, Italic, Code, Heading1, List, ListOrdered, Quote, CodeSquare, Link, Image, Minus } from 'lucide-react';
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
  { icon: CodeSquare, action: 'codeBlock', label: '代码块', shortcut: 'Ctrl+Shift+K' },
  { icon: Link, action: 'link', label: '链接', shortcut: 'Ctrl+L' },
  { icon: Image, action: 'image', label: '图片', shortcut: 'Ctrl+Shift+I' },
  { icon: Minus, action: 'hr', label: '分割线', shortcut: 'Ctrl+Shift+H' },
];

export function Toolbar(): React.JSX.Element {
  const { openFile, saveFile, saveAsFile } = useFileStore();
  const { previewVisible, togglePreview, theme, toggleTheme } = useUIStore();
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
    <div className="toolbar">
      <div className="toolbar-group">
        <button onClick={openFile} title="打开文件 (Ctrl+O)">
          <FileOpen size={18} />
        </button>
        <button onClick={saveFile} title="保存 (Ctrl+S)">
          <FileSave size={18} />
        </button>
        <button onClick={saveAsFile} title="另存为 (Ctrl+Shift+S)">
          <FileSave size={18} />
        </button>
      </div>
      
      <div className="toolbar-divider" />
      
      <div className="toolbar-group">
        {formatButtons.map((btn) => (
          <button
            key={btn.action}
            onClick={() => handleFormatAction(btn.action)}
            title={`${btn.label} (${btn.shortcut})`}
          >
            <btn.icon size={18} />
          </button>
        ))}
      </div>
      
      <div className="toolbar-divider" />
      
      <div className="toolbar-group">
        <button
          onClick={togglePreview}
          title={`${previewVisible ? '隐藏预览' : '显示预览'} (Ctrl+Shift+P)`}
        >
          {previewVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button
          onClick={toggleTheme}
          title={`切换到${theme === 'light' ? '暗黑' : '明亮'}主题`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
}
