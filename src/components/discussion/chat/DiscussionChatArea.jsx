import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  getDiscussionDetail, 
  updateDiscussion, 
  deleteDiscussion,
  getDiscussionChatList,
  sendDiscussionChat,
  summarizeDiscussion
} from '@/services/discussionService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ChatMessage from './ChatMessage';

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.subtleText};
  font-size: 1.1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.header.bg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  flex-shrink: 0;
`;

const TitleBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitleText = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
`;

const ActionsBox = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const OccupiedBanner = styled.div`
  background-color: #E3B341;
  color: #fff;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 500;
  flex-shrink: 0;
`;

const ChatListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const InputAreaContainer = styled.div`
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-shrink: 0;
`;

const ChatTextarea = styled.textarea`
  flex: 1;
  resize: none;
  min-height: ${({ $expanded }) => ($expanded ? '100px' : '44px')};
  max-height: 200px;
  padding: 0.6rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  transition: min-height 0.2s ease-in-out;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.background};
    cursor: not-allowed;
  }
`;

const DiscussionChatArea = ({ discussionId, onDeleted, onUpdated }) => {
  const [detail, setDetail] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  // 입력창 상태
  const [inputContent, setInputContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const chatListRef = useRef(null);

  const loadDiscussionData = async () => {
    if (!discussionId) return;
    try {
      const [detailData, chatData] = await Promise.all([
        getDiscussionDetail(discussionId),
        getDiscussionChatList(discussionId)
      ]);
      setDetail(detailData);

      // 채팅 데이터를 생성 시간(과거가 위, 최신이 아래) 순으로 오름차순 정렬합니다.
      const sortedChats = chatData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setChats(sortedChats);
    } catch (error) {
      console.error("Failed to load discussion data:", error);
    }
  };

  useEffect(() => {
    if (discussionId) {
      setLoading(true);
      setIsEditing(false);
      setInputContent('');
      loadDiscussionData().finally(() => setLoading(false));
    } else {
      setDetail(null);
      setChats([]);
    }
  }, [discussionId]);

  // occupied 상태일 경우 3초마다 폴링하여 AI 응답 대기
  useEffect(() => {
    let interval;
    if (detail?.is_occupied) {
      interval = setInterval(() => {
        loadDiscussionData();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [detail?.is_occupied, discussionId]);

  // 채팅이 업데이트될 때마다 최하단으로 스크롤
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chats]);

  if (!discussionId) {
    return (
      <Container>
        <EmptyState>왼쪽 목록에서 Discussion을 선택해주세요.</EmptyState>
      </Container>
    );
  }

  if (loading && !detail) {
    return (
      <Container>
        <EmptyState>로딩 중...</EmptyState>
      </Container>
    );
  }

  const handleSummarize = async () => {
    try {
      await summarizeDiscussion(discussionId);
      alert('요약 요청이 성공적으로 전송되었습니다.');
      loadDiscussionData(); // 요약 요청 후 상태 갱신 (occupied로 변경될 수 있음)
    } catch (error) {
      alert('요약 요청에 실패했습니다.');
    }
  };

  const handleUpdateTitle = async () => {
    if (!editTitle.trim()) return;
    try {
      await updateDiscussion(discussionId, { title: editTitle });
      setIsEditing(false);
      setDetail(prev => ({ ...prev, title: editTitle }));
      onUpdated();
    } catch (error) {
      alert('제목 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 이 Discussion을 삭제하시겠습니까?')) {
      try {
        await deleteDiscussion(discussionId);
        onDeleted();
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const handleSendChat = async () => {
    if (!inputContent.trim() || isSending) return;
    const currentContent = inputContent;
    setInputContent('');
    setIsFocused(false);
    setIsSending(true);
    
    // Optimistic UI 반영
    const tempChat = {
      id: Date.now(),
      content: currentContent,
      is_by_user: true,
      created_at: new Date().toISOString()
    };
    setChats(prev => [...prev, tempChat]);

    try {
      await sendDiscussionChat(discussionId, { content: currentContent });
      // 즉시 데이터 갱신을 통해 is_occupied 상태를 획득하고 폴링 시작
      await loadDiscussionData();
    } catch (error) {
      alert('메시지 전송에 실패했습니다.');
      setInputContent(currentContent);
      setChats(prev => prev.filter(c => c.id !== tempChat.id));
    } finally {
      setIsSending(false);
    }
  };

  // 타이핑 중이거나 포커스되어 있을 때 입력창 확장
  const isInputExpanded = isFocused || inputContent.length > 0;
  
  // isSending 상태이거나 Occupied일 경우 입력 방지
  const isInputDisabled = detail?.is_occupied || isSending;

  return (
    <Container>
      <Header>
        {isEditing ? (
          <TitleBox>
            <Input 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              autoFocus 
              style={{ width: '300px' }}
              placeholder="새로운 제목을 입력하세요"
            />
          </TitleBox>
        ) : (
          <TitleBox>
            <TitleText>{detail?.title}</TitleText>
          </TitleBox>
        )}

        <ActionsBox>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleUpdateTitle}>저장</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>취소</Button>
              <Button variant="danger" onClick={handleDelete}>삭제</Button>
            </>
          ) : (
            <>
              <Button 
                variant="secondary" 
                onClick={handleSummarize} 
                disabled={detail?.is_occupied}
              >
                요약하기
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setEditTitle(detail?.title || '');
                  setIsEditing(true);
                }}
                disabled={detail?.is_occupied}
              >
                수정
              </Button>
            </>
          )}
        </ActionsBox>
      </Header>

      {detail?.is_occupied && (
        <OccupiedBanner>
          현재 AI가 작업을 수행하고 있습니다. 잠시만 기다려주세요...
        </OccupiedBanner>
      )}

      <ChatListContainer ref={chatListRef}>
        {chats.map(chat => (
          <ChatMessage key={chat.id} chat={chat} />
        ))}
      </ChatListContainer>

      <InputAreaContainer>
        <ChatTextarea
          $expanded={isInputExpanded}
          placeholder={isInputDisabled ? "AI가 응답 중입니다..." : "메시지를 입력하세요..."}
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isInputDisabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendChat();
            }
          }}
        />
        <Button 
          variant="primary" 
          onClick={handleSendChat}
          disabled={isInputDisabled || !inputContent.trim()}
          style={{ alignSelf: 'flex-end', padding: '10px 20px', minHeight: '44px' }}
        >
          전송
        </Button>
      </InputAreaContainer>
    </Container>
  );
};

export default DiscussionChatArea;
