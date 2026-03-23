import React, { useState } from 'react';
import styled from 'styled-components';
import DiscussionSidebar from './sidebar/DiscussionSidebar';

const TabContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 220px);
  min-height: 500px;
  width: 100%;
`;

const ChatArea = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.subtleText};
  font-size: 1.2rem;
`;

const DiscussionTab = ({ projectId }) => {
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);

  return (
    <TabContainer>
      <DiscussionSidebar 
        projectId={projectId} 
        selectedId={selectedDiscussionId}
        onSelect={setSelectedDiscussionId} 
      />
      <ChatArea>
        [구현 예정]
      </ChatArea>
    </TabContainer>
  );
};

export default DiscussionTab;
