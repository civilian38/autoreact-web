import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import { getSessionList } from '@/services/generationService';
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
`;

const SessionItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const SessionTitle = styled.div`
  font-weight: 500;
  color: ${({ $status, theme }) => {
    if ($status === 'ACTIVE') {
      return theme.button.primaryBg; // 초록색 계열
    }
    return theme.text; // COMPLETED일 경우 일반 텍스트 색상
  }};
  text-decoration: ${({ $status }) => $status === 'DISCARDED' ? 'line-through' : 'none'};
`;

const EmptyMessage = styled.p`
  padding: 16px;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  font-size: 0.9rem;
`;

const SessionListSidebar = ({ projectId }) => {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSessionList(projectId);
      setSessions(data.results || []);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Sessions</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Add</Button>
      </SidebarHeader>
      <SessionList>
        {loading ? (
           <EmptyMessage>Loading...</EmptyMessage>
        ) : sessions.length === 0 ? (
           <EmptyMessage>No sessions found.</EmptyMessage>
        ) : (
           sessions.map(session => (
             <SessionItem key={session.id}>
               <SessionTitle $status={session.status}>{session.title}</SessionTitle>
             </SessionItem>
           ))
        )}
      </SessionList>

      <SessionCreateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onSuccess={() => {
           setIsModalOpen(false);
           fetchSessions();
        }}
      />
    </SidebarContainer>
  );
};

export default SessionListSidebar;
