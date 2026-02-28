import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getPages, createPage } from '@/services/pageService';
import PageListSidebar from './sidebar/PageListSidebar';
import PageDetailViewer from './detail/PageDetailViewer';
import PageCreateModal from './modal/PageCreateModal';

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  min-height: 500px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.subtleText};
  border: 1px dashed ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  min-height: 400px;
`;

const PageDescriptionTab = ({ projectId }) => {
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPages(projectId);
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleCreatePage = async ({ url, page_description }) => {
    try {
      const newPage = await createPage(projectId, { url, page_description });
      setPages((prev) => [...prev, newPage]);
      setSelectedPageId(newPage.id);
    } catch (error) {
      console.error('Failed to create page:', error);
      alert('Failed to create page.');
      throw error; // 에러를 던져서 자식 모달에서 로딩 상태 등을 해제할 수 있게 함
    }
  };

  const handlePageDeleted = (deletedId) => {
    setPages((prev) => prev.filter(p => p.id !== deletedId));
    if (selectedPageId === deletedId) {
      setSelectedPageId(null);
    }
  };

  const handlePageUpdated = (updatedPage) => {
    setPages((prev) => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  };

  return (
    <>
      <Container>
        <PageListSidebar
          pages={pages}
          selectedPageId={selectedPageId}
          onSelect={setSelectedPageId}
          onAddClick={() => setIsModalOpen(true)}
          loading={loading}
        />
        {selectedPageId ? (
          <PageDetailViewer
            pageId={selectedPageId}
            onDeleted={handlePageDeleted}
            onUpdated={handlePageUpdated}
          />
        ) : (
          <EmptyState>
            좌측 목록에서 페이지를 선택하거나 새 페이지를 추가하세요.
          </EmptyState>
        )}
      </Container>

      <PageCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePage}
      />
    </>
  );
};

export default PageDescriptionTab;
