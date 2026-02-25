import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getApiDocs, createApiDoc } from '@/services/apiDocsService';
import ApiDocumentDetail from './ApiDocumentDetail';
import ApiDocCreateModal from './ApiDocCreateModal';
import Button from '@/components/ui/Button';

const METHOD_COLORS = {
  GET: '#0366d6',
  POST: '#28a745',
  PUT: '#d29922',
  PATCH: '#dbab09',
  DELETE: '#d73a49',
  HEAD: '#6a737d',
  OPTIONS: '#6a737d',
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const DocItem = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.cardBg};
  overflow: hidden;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
`;

const DocHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 48px;
  border-bottom: ${({ $isOpen, theme }) => $isOpen ? `1px solid ${theme.cardBorder}` : 'none'};
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const MethodBadge = styled.div`
  width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  background-color: ${({ $method }) => METHOD_COLORS[$method] || '#6a737d'};
  font-size: 0.9rem;
`;

const UrlText = styled.div`
  flex: 1;
  padding: 0 16px;
  font-family: monospace;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArrowIcon = styled.div`
  padding: 0 16px;
  color: ${({ theme }) => theme.subtleText};
  font-weight: bold;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(-90deg)' : 'rotate(0)'};
  transition: transform 0.2s;
`;

const DetailContainer = styled.div`
  padding: 0;
  background-color: ${({ theme }) => theme.background};
`;

const ApiDocumentList = ({ projectId }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getApiDocs(projectId);
      setDocs(data);
    } catch (error) {
      console.error('Failed to fetch api docs:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveCreateDoc = async (formData) => {
    const newDoc = await createApiDoc(projectId, formData);
    await fetchDocs();
    setExpandedDocId(newDoc.id);
  };

  const handleToggle = (id) => {
    setExpandedDocId(prev => prev === id ? null : id);
  };

  const handleDocDeleted = (deletedId) => {
    setDocs(prev => prev.filter(doc => doc.id !== deletedId));
    if (expandedDocId === deletedId) setExpandedDocId(null);
  };

  const handleDocUpdated = () => {
    fetchDocs();
  };

  return (
    <ListContainer>
      <ListHeader>
        <SectionTitle>API Document List</SectionTitle>
        <Button onClick={handleOpenCreateModal}>
          + API 문서 생성
        </Button>
      </ListHeader>

      {loading && docs.length === 0 && <p>Loading...</p>}

      {docs.map(doc => (
        <DocItem key={doc.id}>
          <DocHeader
            onClick={() => handleToggle(doc.id)}
            $isOpen={expandedDocId === doc.id}
          >
            <MethodBadge $method={doc.http_method}>
              {doc.http_method}
            </MethodBadge>
            <UrlText>{doc.url}</UrlText>
            <ArrowIcon $isOpen={expandedDocId === doc.id}>{'<'}</ArrowIcon>
          </DocHeader>

          {expandedDocId === doc.id && (
            <DetailContainer>
              <ApiDocumentDetail
                documentId={doc.id}
                onDelete={handleDocDeleted}
                onUpdate={handleDocUpdated}
              />
            </DetailContainer>
          )}
        </DocItem>
      ))}

      <ApiDocCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreateDoc}
      />
    </ListContainer>
  );
};

export default ApiDocumentList;
