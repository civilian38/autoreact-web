import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import SessionCreateModal from '../modal/SessionCreateModal';

const SidebarContainer = styled.div`
  width: 280px;
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cardBg};
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ theme }) => theme.header.bg};
  
  h3 {
    margin: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.header.text};
  }
`;

const SessionList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SessionItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  cursor: pointer;
  background-color: ${({ $isSelected, theme }) => $isSelected ? theme.background : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const SessionTitle = styled.div`
  font-weight: 500;
  color: ${({ $status, theme }) => {
    if ($status === 'ACTIVE') {
      return theme.button.primaryBg;
    }
    return theme.text;
  }};
  text-decoration: ${({ $status }) => $status === 'DISCARDED' ? 'line-through' : 'none'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EmptyMessage = styled.p`
  padding: 16px;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  font-size: 0.9rem;
`;

const LoadMoreContainer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
`;

const SessionListSidebar = ({ 
  projectId, 
  sessions, 
  loading, 
  selectedSessionId, 
  onSelectSession, 
  onRefresh, 
  hasNext, 
  loadingMore, 
  onLoadMore 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Sessions</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Add</Button>
      </SidebarHeader>
      <SessionList>
        {loading && sessions.length === 0 ? (
           <EmptyMessage>Loading...</EmptyMessage>
        ) : sessions.length === 0 ? (
           <EmptyMessage>No sessions found.</EmptyMessage>
        ) : (
           <>
             {sessions.map(session => (
               <SessionItem 
                 key={session.id}
                 $isSelected={session.id === selectedSessionId}
                 onClick={() => onSelectSession(session.id)}
               >
                 <SessionTitle $status={session.status}>
                   <span>{session.title}</span>
                   {session.is_occupied && <span title="Occupied">⏳</span>}
                 </SessionTitle>
               </SessionItem>
             ))}
             {hasNext && (
               <LoadMoreContainer>
                 <Button variant="secondary" onClick={onLoadMore} disabled={loadingMore}>
                   {loadingMore ? 'Loading...' : 'Load More'}
                 </Button>
               </LoadMoreContainer>
             )}
           </>
        )}
      </SessionList>

      <SessionCreateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onSuccess={() => {
           setIsModalOpen(false);
           onRefresh();
        }}
      />
    </SidebarContainer>
  );
};

export default SessionListSidebar;
