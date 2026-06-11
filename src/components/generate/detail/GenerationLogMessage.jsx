import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
`;

const Bubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${({ $isUser, theme }) => 
    $isUser ? theme.primary : theme.cardBorder};
  color: ${({ $isUser, theme }) => 
    $isUser ? '#FFFFFF' : theme.text};
  word-break: break-word;
  line-height: 1.5;

  /* Markdown Styles inside AI bubble */
  p { margin-top: 0; margin-bottom: 0.5em; }
  p:last-child { margin-bottom: 0; }
  pre {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
  }
  code {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
  }
  th, td {
    border: 1px solid ${({ theme }) => theme.inputBorder};
    padding: 6px 8px;
  }
  a {
    color: ${({ $isUser }) => $isUser ? '#FFFFFF' : 'inherit'};
    text-decoration: underline;
  }
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

const GenerationLogMessage = ({ log }) => {
  const dateObj = new Date(log.created_at);
  const timeString = isNaN(dateObj) ? '' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <MessageWrapper $isUser={log.is_by_user}>
      <Bubble $isUser={log.is_by_user}>
        {log.is_by_user ? (
          log.content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {log.content}
          </ReactMarkdown>
        )}
      </Bubble>
      <Timestamp>{timeString}</Timestamp>
    </MessageWrapper>
  );
};

export default GenerationLogMessage;
