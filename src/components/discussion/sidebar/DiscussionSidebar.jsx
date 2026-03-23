import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getDiscussionList } from '@/services/discussionService';
import Button from '@/components/ui/Button';
import DiscussionItem from './DiscussionItem';
import DiscussionCreateModal from '../modal/DiscussionCreateModal';
import DiscussionSummaryModal from '../modal/DiscussionSummaryModal';

const SidebarContainer = styled.div`
  width: 320px;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ theme }) => theme.header.bg};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LoadingText = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
`;

const DiscussionSidebar = ({ projectId, selectedId, onSelect }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [summaryModalId, setSummaryModalId] = useState(null);

  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDiscussionList(projectId);
      // 최신 수정순 정렬
      const sortedData = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setDiscussions(sortedData);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handleDiscussionCreated = () => {
    fetchDiscussions();
  };

  return (
    <SidebarContainer>
      <Header>
        <Title>Discussions</Title>
        <Button 
          variant="primary" 
          onClick={() => setIsCreateModalOpen(true)}
          style={{ padding: '4px 12px', fontSize: '0.9rem' }}
        >
          + Add
        </Button>
      </Header>
      <ListContainer>
        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : discussions.length === 0 ? (
          <LoadingText>No discussions yet.</LoadingText>
        ) : (
          discussions.map((disc) => (
            <DiscussionItem
              key={disc.id}
              discussion={disc}
              isSelected={selectedId === disc.id}
              onClick={() => onSelect(disc.id)}
              onShowSummary={() => setSummaryModalId(disc.id)}
            />
          ))
        )}
      </ListContainer>

      <DiscussionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onCreated={handleDiscussionCreated}
      />

      {summaryModalId && (
        <DiscussionSummaryModal
          isOpen={!!summaryModalId}
          onClose={() => setSummaryModalId(null)}
          discussionId={summaryModalId}
        />
      )}
    </SidebarContainer>
  );
};

export default DiscussionSidebar;
