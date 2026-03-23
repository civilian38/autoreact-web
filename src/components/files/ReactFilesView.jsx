import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getFolderStructure, updateFolder, createFolder, deleteFolder } from '@/services/fileStructureService';
import FileTreeView from './tree/FileTreeView';
import ContextMenu from './ContextMenu';
import FolderRenameModal from './modal/FolderRenameModal';
import FolderMoveModal from './modal/FolderMoveModal';
import FolderCreateModal from './modal/FolderCreateModal';

const Container = styled.div`
  display: flex;
  height: calc(100vh - 280px);
  min-height: 500px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.cardBg};
`;

const TreePane = styled.div`
  width: 300px;
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background};
`;

const TreeHeader = styled.div`
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.header.bg};
`;

const TreeContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const DetailPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.body};
`;

const DetailContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.subtleText};
  font-size: 1.1rem;
`;

const ReactFilesView = ({ projectId }) => {
  const [rootFolder, setRootFolder] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [contextMenu, setContextMenu] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'create' | 'rename' | 'move', target: folderData }

  const fetchStructure = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFolderStructure(projectId);
      setRootFolder(data);
    } catch (e) {
      console.error(e);
      alert('파일 구조를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStructure();
  }, [fetchStructure]);

  const handleContextMenu = (e, type, target) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      target,
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      try {
        await deleteFolder(folderId);
        await fetchStructure();
      } catch (e) {
        console.error(e);
        alert('폴더 삭제에 실패했습니다.');
      }
    }
  };

  const getContextMenuOptions = () => {
    if (!contextMenu) return [];
    const { type, target } = contextMenu;
    
    if (type === 'folder') {
      const isRoot = rootFolder && target.id === rootFolder.id;
      const options = [
        { label: 'Create Folder', action: () => setModal({ type: 'create', target }) },
      ];
      
      if (!isRoot) {
        options.push({ label: 'Rename Folder', action: () => setModal({ type: 'rename', target }) });
        options.push({ label: 'Move Folder', action: () => setModal({ type: 'move', target }) });
        options.push({ label: 'Delete Folder', action: () => handleDeleteFolder(target.id) });
      }
      return options;
    }
    
    // 파일에 대한 컨텍스트 메뉴는 추후 확장 가능
    return [];
  };

  const handleFolderUpdate = async (folderId, data) => {
    try {
      await updateFolder(folderId, data);
      await fetchStructure(); // 성공 시 파일 트리 새로고침
      setModal(null);
    } catch (e) {
      console.error(e);
      alert('폴더 수정에 실패했습니다.');
    }
  };

  const handleFolderCreate = async (parentFolderId, name) => {
    try {
      await createFolder(projectId, { name, parent_folder: parentFolderId });
      await fetchStructure();
      setModal(null);
    } catch (e) {
      console.error(e);
      alert('폴더 생성에 실패했습니다.');
    }
  };

  if (loading) {
    return <Container><DetailContent>Loading file structure...</DetailContent></Container>;
  }

  if (!rootFolder) {
    return <Container><DetailContent>No files found.</DetailContent></Container>;
  }

  return (
    <Container>
      <TreePane>
        <TreeHeader>Explorer</TreeHeader>
        <TreeContent>
          <FileTreeView 
            folder={rootFolder} 
            depth={0} 
            selectedFileId={selectedFileId}
            onSelectFile={setSelectedFileId}
            onContextMenu={handleContextMenu}
          />
        </TreeContent>
      </TreePane>
      <DetailPane>
        {selectedFileId ? (
          <DetailContent>[구현 예정]</DetailContent>
        ) : (
          <DetailContent>Select a file to view code.</DetailContent>
        )}
      </DetailPane>

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={closeContextMenu}
          options={getContextMenuOptions()}
        />
      )}

      {modal && modal.type === 'create' && (
        <FolderCreateModal 
          isOpen={true}
          onClose={() => setModal(null)}
          parentFolder={modal.target}
          onConfirm={(name) => handleFolderCreate(modal.target.id, name)}
        />
      )}

      {modal && modal.type === 'rename' && (
        <FolderRenameModal 
          isOpen={true}
          onClose={() => setModal(null)}
          folder={modal.target}
          onConfirm={(name) => handleFolderUpdate(modal.target.id, { name })}
        />
      )}

      {modal && modal.type === 'move' && (
        <FolderMoveModal 
          isOpen={true}
          onClose={() => setModal(null)}
          folder={modal.target}
          rootFolder={rootFolder}
          onConfirm={(parent_folder) => handleFolderUpdate(modal.target.id, { parent_folder })}
        />
      )}
    </Container>
  );
};

export default ReactFilesView;
