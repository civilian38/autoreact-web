import React, { useState } from 'react';
import styled from 'styled-components';
import DiscussionSidebar from './sidebar/DiscussionSidebar';
import DiscussionChatArea from './chat/DiscussionChatArea';

const TabContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 220px);
  min-height: 500px;
  width: 100%;
`;

const DiscussionTab = ({ projectId }) => {
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
  const [refreshSidebarToggle, setRefreshSidebarToggle] = useState(false);

  const triggerSidebarRefresh = () => {
    setRefreshSidebarToggle((prev) => !prev);
  };

  const handleDiscussionDeleted = () => {
    setSelectedDiscussionId(null);
    triggerSidebarRefresh();
  };

  return (
    <TabContainer>
      <DiscussionSidebar 
        projectId={projectId} 
        selectedId={selectedDiscussionId}
        onSelect={setSelectedDiscussionId} 
        refreshTrigger={refreshSidebarToggle}
      />
      <DiscussionChatArea 
        discussionId={selectedDiscussionId}
        onDeleted={handleDiscussionDeleted}
        onUpdated={triggerSidebarRefresh}
      />
    </TabContainer>
  );
};

export default DiscussionTab;
