import React, { useState } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';

const ViewerContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  overflow: hidden;
  background-color: transparent; /* 배경색 통일 */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.header.bg};
  border-bottom: 1px solid ${({ theme }) => theme.header.border};
`;

const Title = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.subtleText};
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.background};
  }
`;

const EditorWrapper = styled.div`
  padding: 8px 0;
`;

const JsonViewer = ({ data, title = "JSON Example" }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const jsonString = JSON.stringify(data || {}, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0D1117', // 프로젝트 다크 테마 바탕색과 동일하게
      }
    });
    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#FFFFFF', // 프로젝트 라이트 테마 바탕색과 동일하게
      }
    });
  };

  return (
    <ViewerContainer>
      <Header>
        <Title>{title}</Title>
        <CopyButton onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </CopyButton>
      </Header>
      <EditorWrapper>
        <Editor
          height="250px"
          defaultLanguage="json"
          value={jsonString}
          beforeMount={handleEditorWillMount}
          theme={theme === 'dark' ? 'custom-dark' : 'custom-light'}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 }
          }}
        />
      </EditorWrapper>
    </ViewerContainer>
  );
};

export default JsonViewer;
