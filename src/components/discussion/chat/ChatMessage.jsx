import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 1rem;
  width: 100%;
`;

const Bubble = styled.div`
  max-width: 80%;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
  
  ${({ $isUser, theme }) =>
    $isUser
      ? `
    background-color: ${theme.primary};
    color: #FFFFFF;
    border-bottom-right-radius: 2px;
  `
      : `
    background-color: ${theme.cardBg};
    color: ${theme.text};
    border: 1px solid ${theme.cardBorder};
    border-bottom-left-radius: 2px;
  `}

  /* Markdown Styles inside Bubble */
  p { 
    margin: 0 0 0.5rem 0; 
  }
  p:last-child { 
    margin: 0; 
  }
  pre {
    background-color: rgba(0, 0, 0, 0.15);
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;
  }
  code {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.15);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }
  ul, ol {
    margin: 0 0 0.5rem 1.5rem;
    padding: 0;
  }
  a {
    color: ${({ $isUser }) => ($isUser ? '#FFFFFF' : 'inherit')};
    text-decoration: underline;
  }
`;

const TimeStamp = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 0.3rem;
  padding: 0 0.5rem;
`;

const ChatMessage = ({ chat }) => {
  const timeString = new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <MessageContainer $isUser={chat.is_by_user}>
      <Bubble $isUser={chat.is_by_user}>
        {chat.is_by_user ? (
          // 유저 메시지는 단순 텍스트로 처리하여 의도치 않은 마크다운 변환 방지
          <span style={{ whiteSpace: 'pre-wrap' }}>{chat.content}</span>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {chat.content}
          </ReactMarkdown>
        )}
      </Bubble>
      <TimeStamp>{timeString}</TimeStamp>
    </MessageContainer>
  );
};

export default ChatMessage;
