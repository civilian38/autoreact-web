import React from 'react';
import styled from 'styled-components';
import SessionListSidebar from './sidebar/SessionListSidebar';

const TabContainer = styled.div`
  display: flex;
  height: calc(100vh - 220px); /* 대략적인 전체 높이 지정 */
  min-height: 600px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.cardBg};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.subtleText};
  font-size: 1.2rem;
`;

const GenerateTab = ({ projectId }) => {
  return (
    <TabContainer>
      <SessionListSidebar projectId={projectId} />
      <MainContent>
        <Message>구현 예정</Message>
      </MainContent>
    </TabContainer>
  );
};

export default GenerateTab;
