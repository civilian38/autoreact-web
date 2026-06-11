import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import GenerationLogMessage from './GenerationLogMessage';
import { getGenerationLogs, requestGeneration, completeSession, discardSession } from '@/services/generationService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.cardBg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ theme }) => theme.header.bg};
`;

const TitleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
`;

const StatusBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ $status, theme }) => {
    if ($status === 'COMPLETED') return theme.button.primaryBg;
    if ($status === 'DISCARDED') return theme.subtleText;
    return theme.primary;
  }};
  color: #fff;
`;

const OccupiedBadge = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.button.dangerBg};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const LogArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.background};
`;

const InputContainer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ theme }) => theme.cardBg};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AutoResizingTextarea = styled.textarea`
  width: 100%;
  min-height: 50px;
  max-height: 200px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.background};
    cursor: not-allowed;
  }
`;

const InputFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
  margin-top: auto;
  margin-bottom: auto;
`;

const GenerationDetailArea = ({ session, onSessionUpdated }) => {
  const [logs, setLogs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const logsEndRef = useRef(null);

  const fetchLogs = async () => {
    try {
      const data = await getGenerationLogs(session.id);
      const sorted = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setLogs(sorted);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    }
  };

  // 채팅 로그도 5초마다 갱신하여 AI의 답변을 받아옵니다.
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [session.id]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isSending, session.is_occupied]);

  const handleInput = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // API 409 에러 핸들링 유틸리티
  const handleApiError = (error) => {
    if (error.response && error.response.status === 409) {
      const detail = error.response.data.detail || '';
      if (detail.includes('not active')) {
        alert('세션이 ACTIVE 상태가 아니므로 해당 요청을 할 수 없습니다.');
      } else if (detail.includes('occupied')) {
        alert('현재 해당 세션에서 작업이 처리 중입니다. 잠시 후 다시 시도해 주세요.');
      } else if (detail.includes('to do')) {
        alert('프로젝트의 요구사항이 수락되지 않았습니다. Project Settings에서 요청사항을 먼저 수락해 주세요.');
      } else {
        alert(detail);
      }
    } else {
      alert('요청 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsSending(true);
    try {
      await requestGeneration(session.id, { content: inputText.trim() });
      setInputText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      
      // 부모 컴포넌트에 목록 갱신(occupied 상태 반영 등)을 요청
      onSessionUpdated();
      // 로그도 직후 한 번 갱신
      setTimeout(fetchLogs, 500);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('정말 이 세션의 변경사항을 수락하고 실제 코드에 반영하시겠습니까?')) return;
    try {
      await completeSession(session.id);
      alert('세션이 성공적으로 완료되었으며 파일이 업데이트되었습니다.');
      onSessionUpdated();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDiscard = async () => {
    if (!window.confirm('정말 이 세션의 변경사항을 폐기하고 원래 코드로 복구하시겠습니까?')) return;
    try {
      await discardSession(session.id);
      alert('세션이 성공적으로 폐기되었습니다.');
      onSessionUpdated();
    } catch (error) {
      handleApiError(error);
    }
  };

  const isInputDisabled = session.status !== 'ACTIVE' || session.is_occupied || isSending;

  return (
    <Container>
      <Header>
        <TitleInfo>
          <Title>{session.title}</Title>
          <StatusBadge $status={session.status}>{session.status}</StatusBadge>
          {session.is_occupied && <OccupiedBadge>⏳ AI가 작업 중입니다...</OccupiedBadge>}
        </TitleInfo>
        {session.status === 'ACTIVE' && (
          <ActionGroup>
            <Button variant="danger" onClick={handleDiscard} disabled={session.is_occupied}>Discard</Button>
            <Button variant="primary" onClick={handleComplete} disabled={session.is_occupied}>Complete</Button>
          </ActionGroup>
        )}
      </Header>
      <LogArea>
        {logs.length === 0 ? (
          <EmptyMessage>아직 주고받은 메시지가 없습니다. AI에게 구현을 요청해 보세요.</EmptyMessage>
        ) : (
          logs.map((log, idx) => (
            <GenerationLogMessage key={idx} log={log} />
          ))
        )}
        {(isSending || session.is_occupied) && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--subtleText)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            AI가 답변을 생성 중입니다...
          </div>
        )}
        <div ref={logsEndRef} />
      </LogArea>
      {session.status === 'ACTIVE' && (
        <InputContainer>
          <AutoResizingTextarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isInputDisabled ? "현재 입력할 수 없습니다." : "수정 요청사항을 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"}
            disabled={isInputDisabled}
          />
          <InputFooter>
            <Button onClick={handleSend} disabled={!inputText.trim() || isInputDisabled}>
              Send Request
            </Button>
          </InputFooter>
        </InputContainer>
      )}
    </Container>
  );
};

export default GenerationDetailArea;
