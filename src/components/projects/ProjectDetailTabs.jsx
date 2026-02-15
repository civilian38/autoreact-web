import React, { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  position: sticky;
  top: 60px; /* Height of the main Header */
  background-color: ${({ theme }) => theme.body};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  z-index: 999;
  width: 100%;
`;

const TabList = styled.nav`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${({ theme, $isActive }) => ($isActive ? theme.text : theme.subtleText)};
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  padding: 1rem 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.text};
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    border-bottom-color: ${theme.primary};
  `}
`;

const ProjectDetailTabs = () => {
  const TABS = [
    'API DOC',
    'Page Description',
    'Files',
    'Discussion',
    'Generate',
    'Project Settings',
  ];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    alert(`'${tab}' 기능은 아직 구현되지 않았습니다.`);
  };

  return (
    <TabsContainer>
      <TabList>
        {TABS.map((tab) => (
          <TabButton
            key={tab}
            $isActive={activeTab === tab}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </TabButton>
        ))}
      </TabList>
    </TabsContainer>
  );
};

export default ProjectDetailTabs;
