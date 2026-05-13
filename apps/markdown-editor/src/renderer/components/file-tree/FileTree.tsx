import React, { useEffect, useState, useCallback } from 'react';
import { Folder, FolderOpen, FileText } from 'lucide-react';
import { useFileStore } from '../../stores/fileStore';
import { useEditorStore } from '../../stores/editorStore';
import './FileTree.css';

interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeItem[];
}

function TreeNode({ 
  item, 
  level = 0 
}: { 
  item: FileTreeItem; 
  level?: number 
}): React.JSX.Element {
  const { loadDirectory, openFile } = useFileStore();
  const { setContent } = useEditorStore();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  
  const toggleDirectory = useCallback((path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleFileClick = useCallback(async (clickedItem: FileTreeItem) => {
    if (clickedItem.type === 'directory') {
      toggleDirectory(clickedItem.path);
      await loadDirectory(clickedItem.path);
    } else {
      await openFile(clickedItem.path);
    }
  }, [toggleDirectory, loadDirectory, openFile]);

  const isExpanded = expandedDirs.has(item.path);

  return (
    <>
      <div
        className={`file-tree-item ${item.type}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => handleFileClick(item)}
      >
        {item.type === 'directory' ? (
          <>
            {isExpanded ? (
              <FolderOpen size={16} />
            ) : (
              <Folder size={16} />
            )}
            <span>{item.name}</span>
          </>
        ) : (
          <>
            <FileText size={16} />
            <span>{item.name}</span>
          </>
        )}
      </div>
      {item.type === 'directory' && isExpanded && item.children?.map((child) => (
        <TreeNode 
          key={child.path} 
          item={child} 
          level={level + 1} 
        />
      ))}
    </>
  );
}

export function FileTree(): React.JSX.Element {
  const { fileTree, loadDirectory } = useFileStore();

  useEffect(() => {
    loadDirectory('/');
  }, [loadDirectory]);

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <span>文件目录</span>
      </div>
      <div className="file-tree-content">
        {fileTree.length === 0 ? (
          <div className="file-tree-empty">暂无文件</div>
        ) : (
          fileTree.map((item) => (
            <TreeNode key={item.path} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
