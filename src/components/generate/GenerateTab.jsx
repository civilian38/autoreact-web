import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import SessionListSidebar from './sidebar/SessionListSidebar';
import GenerationDetailArea from './detail/GenerationDetailArea';
import { getSessionList } from '@/services/generationService';

const TabContainer = styled.div`
  display: flex;
  height: calc(100vh - 220px);
  min-height: 600px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.cardBg};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background};
`;

const MessageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.subtleText};
  font-size: 1.2rem;
`;

const GenerateTab = ({ projectId }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // 세션 목록 폴링 및 초기 로딩
  const fetchSessions = useCallback(async (isInitial = false) => {
    try {
      const data = await getSessionList(projectId);
      const newResults = data.results || [];
      
      setSessions(prev => {
        if (isInitial) return newResults;
        
        // 기존 상태와 병합하여 중복 제거 후 최신순(내림차순) 정렬
        const newIds = new Set(newResults.map(s => s.id));
        const remaining = prev.filter(s => !newIds.has(s.id));
        const merged = [...newResults, ...remaining];
        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return merged;
      });

      if (isInitial) {
        setNextUrl(data.next);
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [projectId]);

  // 커서를 이용한 다음 페이지 로드
  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await getSessionList(projectId, nextUrl);
      const newResults = data.results || [];
      
      setSessions(prev => {
        const newIds = new Set(newResults.map(s => s.id));
        const remaining = prev.filter(s => !newIds.has(s.id));
        const merged = [...remaining, ...newResults];
        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return merged;
      });
      setNextUrl(data.next);
    } catch (error) {
      console.error('Failed to load more sessions', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchSessions(true);
    // 상태 업데이트를 위해 주기적으로 1페이지만 폴링합니다.
    const interval = setInterval(() => fetchSessions(false), 5000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const selectedSession = sessions.find(s => s.id === selectedSessionId) || null;

  return (
    <TabContainer>
      <SessionListSidebar 
        projectId={projectId}
        sessions={sessions}
        loading={loading}
        selectedSessionId={selectedSessionId}
        onSelectSession={setSelectedSessionId}
        onRefresh={() => fetchSessions(true)}
        hasNext={!!nextUrl}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />
      <MainContent>
        {selectedSession ? (
          <GenerationDetailArea 
            key={selectedSession.id}
            session={selectedSession}
            onSessionUpdated={() => fetchSessions(false)}
          />
        ) : (
          <MessageContainer>
            <Message>조회할 Session을 선택하거나 새로 생성하세요.</Message>
          </MessageContainer>
        )}
      </MainContent>
    </TabContainer>
  );
};

export default GenerateTab;
