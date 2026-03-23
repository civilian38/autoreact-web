import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import Button from '@/components/ui/Button';
import { getFileDetail, updateFile, deleteFile } from '@/services/fileService';
import { useTheme } from '@/hooks/useTheme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.body};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FileName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FilePath = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightSide = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.subtleText};
  font-size: 1.1rem;
`;

const FileDetailView = ({ fileId, onFileUpdate, onDeleteSuccess }) => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState('current'); // 'current' | 'draft'
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { theme } = useTheme();

  const fetchFileDetail = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFileDetail(id);
      setFileData(data);
      
      const initialMode = data.has_draft ? 'draft' : 'current';
      setViewMode(initialMode);
      setEditContent(initialMode === 'draft' ? data.draft_content : data.content);
      setIsEditing(false);
    } catch (e) {
      setError('파일 내용을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) {
      fetchFileDetail(fileId);
    }
  }, [fileId]);

  const handleCopy = () => {
    const contentToCopy = isEditing ? editContent : (viewMode === 'draft' ? fileData.draft_content : fileData.content);
    navigator.clipboard.writeText(contentToCopy || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleViewMode = () => {
    const newMode = viewMode === 'draft' ? 'current' : 'draft';
    setViewMode(newMode);
    if (isEditing) {
       setEditContent(newMode === 'draft' ? fileData.draft_content : fileData.content);
    }
  };

  const handleEditContent = () => {
    setIsEditing(true);
    setEditContent(viewMode === 'draft' ? fileData.draft_content : fileData.content);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${fileData.name}?`)) {
      try {
        await deleteFile(fileId);
        onDeleteSuccess();
      } catch (e) {
        alert('파일 삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateFile(fileId, { 
         content: editContent,
         folder: fileData.folder
      });
      await fetchFileDetail(fileId);
      onFileUpdate();
    } catch (e) {
      alert('파일 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(viewMode === 'draft' ? fileData.draft_content : fileData.content);
  };
  
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0D1117', // 프로젝트 다크 테마 배경색
      }
    });
    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#FFFFFF', // 프로젝트 라이트 테마 배경색
      }
    });
  };

  if (loading) {
    return <Message>Loading file content...</Message>;
  }

  if (error) {
    return <Message>{error}</Message>;
  }

  if (!fileData) {
    return null;
  }

  const ext = fileData.name.split('.').pop().toLowerCase();
  const langMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    css: 'css',
    html: 'html',
    py: 'python',
  };
  const language = langMap[ext] || 'plaintext';
  const displayContent = isEditing ? editContent : (viewMode === 'draft' ? fileData.draft_content : fileData.content);

  return (
    <Container>
      <Header>
        <LeftSide>
          <FileName>{fileData.name}</FileName>
          <FilePath>{fileData.file_path || `${fileData.folder}/${fileData.name}`}</FilePath>
        </LeftSide>
        <RightSide>
          {fileData.has_draft && !isEditing && (
            <Button variant="secondary" onClick={handleToggleViewMode}>
              {viewMode === 'draft' ? 'See Original' : 'See Draft'}
            </Button>
          )}
          
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} disabled={isSaving}>Delete</Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCopy}>{isCopied ? 'Copied! ✅' : 'Copy'}</Button>
              <Button variant="primary" onClick={handleEditContent}>Edit Content</Button>
            </>
          )}
        </RightSide>
      </Header>
      <ContentArea>
        <Editor
          height="100%"
          language={language}
          beforeMount={handleEditorWillMount}
          theme={theme === 'dark' ? 'custom-dark' : 'custom-light'}
          value={displayContent || ''}
          onChange={(val) => { if (isEditing) setEditContent(val); }}
          options={{
            readOnly: !isEditing,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </ContentArea>
    </Container>
  );
};

export default FileDetailView;
