import React, { useCallback } from 'react';
import { FileText, Clock, Trash2, FolderOpen } from 'lucide-react';
import { useFileStore } from '../../stores/fileStore';
import './RecentFiles.css';

interface RecentFileItemProps {
  file: {
    path: string;
    name: string;
    lastOpened: number;
  };
  isActive: boolean;
  onOpen: (path: string) => void;
  onRemove: (path: string) => void;
}

function RecentFileItem({ file, isActive, onOpen, onRemove }: RecentFileItemProps) {
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  const getDirectory = (path: string): string => {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/');
  };

  return (
    <div
      className={`recent-file-item ${isActive ? 'active' : ''}`}
      onClick={() => onOpen(file.path)}
    >
      <FileText size={16} className="recent-file-icon" />
      <div className="recent-file-info">
        <div className="recent-file-name">{file.name}</div>
        <div className="recent-file-path" title={file.path}>
          {getDirectory(file.path)}
        </div>
      </div>
      <span className="recent-file-time">{formatTime(file.lastOpened)}</span>
      <div className="recent-file-actions">
        <button
          className="recent-file-action danger"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.path);
          }}
          title="从列表中移除"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export function RecentFiles(): React.JSX.Element {
  const { recentFiles, currentFile, openFile, removeRecentFile, clearRecentFiles } = useFileStore();

  const handleOpenFile = useCallback(async (path: string) => {
    await openFile(path);
  }, [openFile]);

  const handleRemoveFile = useCallback((path: string) => {
    useFileStore.setState((state) => ({
      recentFiles: state.recentFiles.filter((f) => f.path !== path),
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    if (recentFiles.length > 0) {
      useFileStore.setState({ recentFiles: [] });
    }
  }, [recentFiles.length]);

  return (
    <div className="recent-files">
      <div className="recent-files-header">
        <span>最近文件</span>
        {recentFiles.length > 0 && (
          <div className="recent-files-header-actions">
            <button className="clear-recent-btn" onClick={handleClearAll}>
              清空
            </button>
          </div>
        )}
      </div>
      <div className="recent-files-content">
        {recentFiles.length === 0 ? (
          <div className="recent-files-empty">
            <Clock size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div>暂无最近文件</div>
            <div style={{ fontSize: '12px', marginTop: 4 }}>
              打开的文件会显示在这里
            </div>
          </div>
        ) : (
          recentFiles.map((file) => (
            <RecentFileItem
              key={file.path}
              file={file}
              isActive={currentFile?.path === file.path}
              onOpen={handleOpenFile}
              onRemove={handleRemoveFile}
            />
          ))
        )}
      </div>
    </div>
  );
}
