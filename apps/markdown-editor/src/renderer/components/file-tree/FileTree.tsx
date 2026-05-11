import React, { useEffect, useState } from 'react';
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

export function FileTree(): React.JSX.Element {
  const { fileTree, loadDirectory, openFile } = useFileStore();
  const { setContent } = useEditorStore();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDirectory('/');
  }, [loadDirectory]);

  const toggleDirectory = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleFileClick = async (item: FileTreeItem) => {
    if (item.type === 'directory') {
      toggleDirectory(item.path);
      await loadDirectory(item.path);
    } else {
      await openFile();
    }
  };

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <span>文件目录</span>
      </div>
      <div className="file-tree-content">
        {fileTree.map((item) => (
          <div
            key={item.path}
            className={`file-tree-item ${item.type}`}
            onClick={() => handleFileClick(item)}
          >
            {item.type === 'directory' ? (
              <>
                {expandedDirs.has(item.path) ? (
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
        ))}
      </div>
    </div>
  );
}
