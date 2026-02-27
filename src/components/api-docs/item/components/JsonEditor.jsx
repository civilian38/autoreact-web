import React, { useEffect, useRef } from 'react';
import { JSONEditor } from 'vanilla-jsoneditor';
import styled from 'styled-components';
import { useTheme } from '@/hooks/useTheme';

const EditorContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  overflow: hidden;
  height: 300px;
  
  /* Fallback dark theme variables to ensure jse-theme-dark works properly */
  &.jse-theme-dark {
    --jse-theme-color: ${({ theme }) => theme.primary};
    --jse-background-color: ${({ theme }) => theme.inputBg};
    --jse-panel-background: ${({ theme }) => theme.header.bg};
    --jse-panel-color: ${({ theme }) => theme.text};
    --jse-panel-border: ${({ theme }) => theme.inputBorder};
    --jse-main-border: ${({ theme }) => theme.inputBorder};
    --jse-menu-color: ${({ theme }) => theme.text};
    --jse-text-color-inverse: ${({ theme }) => theme.text};
    
    --jse-key-color: #58A6FF;
    --jse-value-color-string: #A5D6FF;
    --jse-value-color-number: #79C0FF;
    --jse-value-color-boolean: #D2A8FF;
    --jse-value-color-null: #8B949E;
    --jse-delimiter-color: #FFFFFF;
  }
`;

const JsonEditorWrapper = ({ initialContent, onChange, readOnly = false }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    editorRef.current = new JSONEditor({
      target: containerRef.current,
      props: {
        content: { json: initialContent || {} },
        onChange: (updatedContent, previousContent, { errors }) => {
          if (onChange) {
            let parsedData = null;
            let isValid = true;

            if (updatedContent.json !== undefined) {
              parsedData = updatedContent.json;
            } else if (updatedContent.text !== undefined) {
              try {
                parsedData = JSON.parse(updatedContent.text);
              } catch (e) {
                isValid = false;
              }
            }

            if (isValid && parsedData !== null) {
              onChange(parsedData);
            }
          }
        },
        readOnly
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <EditorContainer
      ref={containerRef}
      className={theme === 'dark' ? 'jse-theme-dark' : ''}
    />
  );
};

export default JsonEditorWrapper;
