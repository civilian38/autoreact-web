import React, { useState } from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  padding-left: ${({ $depth }) => $depth * 16 + 8}px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: ${({ theme, $isDraft }) => ($isDraft ? theme.primary : theme.text)};
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.button.secondaryHoverBg : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.button.secondaryHoverBg};
  }
`;

const Icon = styled.span`
  margin-right: 6px;
  font-size: 14px;
  display: inline-flex;
  width: 18px;
  justify-content: center;
`;

const EmptyText = styled.div`
  padding: 4px 8px;
  padding-left: ${({ $depth }) => $depth * 16 + 8 + 24}px;
  font-size: 13px;
  color: ${({ theme }) => theme.subtleText};
  font-style: italic;
`;

const FileTreeView = ({ folder, depth, selectedFileId, onSelectFile, onContextMenu }) => {
  // 기본적으로 펼쳐진 상태
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleRightClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onContextMenu(e, 'folder', folder);
  };

  const handleFileClick = (e, fileId) => {
    e.stopPropagation();
    onSelectFile(fileId);
  };

  const handleFileRightClick = (e, file) => {
    e.stopPropagation();
    e.preventDefault();
    onContextMenu(e, 'file', file);
  };

  const hasChildren = (folder.subfolders && folder.subfolders.length > 0) || (folder.files && folder.files.length > 0);

  return (
    <div>
      {/* Folder Item */}
      <ItemContainer 
        $depth={depth} 
        onClick={handleToggle}
        onContextMenu={handleRightClick}
      >
        <Icon>{isOpen ? '📂' : '📁'}</Icon>
        {folder.name}
      </ItemContainer>

      {/* Children */}
      {isOpen && (
        <>
          {folder.subfolders && folder.subfolders.map(sub => (
            <FileTreeView 
              key={`folder-${sub.id}`} 
              folder={sub} 
              depth={depth + 1}
              selectedFileId={selectedFileId}
              onSelectFile={onSelectFile}
              onContextMenu={onContextMenu}
            />
          ))}
          {folder.files && folder.files.map(file => (
            <ItemContainer 
              key={`file-${file.id}`}
              $depth={depth + 1}
              $isDraft={file.has_draft}
              $isSelected={selectedFileId === file.id}
              onClick={(e) => handleFileClick(e, file.id)}
              onContextMenu={(e) => handleFileRightClick(e, file)}
            >
              <Icon>📄</Icon>
              {file.name}
            </ItemContainer>
          ))}
          {/* Empty Folder Indicator */}
          {!hasChildren && (
            <EmptyText $depth={depth}>(Empty)</EmptyText>
          )}
        </>
      )}
    </div>
  );
};

export default FileTreeView;
