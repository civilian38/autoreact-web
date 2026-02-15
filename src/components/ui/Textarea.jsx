import React from 'react';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.inputBg};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }

  &[disabled] {
    background-color: ${({ theme }) => theme.background};
    cursor: not-allowed;
  }
`;

const Textarea = React.forwardRef((props, ref) => {
  return <StyledTextarea {...props} ref={ref} />;
});

export default Textarea;
