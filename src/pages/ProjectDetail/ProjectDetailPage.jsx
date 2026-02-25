import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import ProjectDetailTabs, { TABS } from '@/components/projects/ProjectDetailTabs';
import ProjectSettings from './ProjectSettings';
import ApiDocsTab from '@/components/api-docs/ApiDocsTab';

// Wrapper for the entire page to ensure proper layout for sticky elements
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px); /* Full viewport height minus header */
`;

// Container for the non-sticky part (Project Name/Description)
const ProjectHeaderContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem 1.5rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const ProjectName = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.subtleText};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Container for the scrollable content area below the tabs
const ContentContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.1rem;
  padding: 2rem 0; /* Adjusted padding */
  color: ${({ theme }) => theme.subtleText};
`;

const ErrorMessage = styled(Message)`
  color: #ff4d4d;
`;

const LoadingContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { project, loading, error, updateProject, deleteProject } = useProjectDetail(projectId);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'API DOC':
        return <ApiDocsTab projectId={projectId} />;
      case 'Project Settings':
        return <ProjectSettings project={project} onUpdate={updateProject} onDelete={deleteProject} />;
      case 'Page Description':
      case 'Files':
      case 'Discussion':
      case 'Generate':
        return <Message>{activeTab} 기능은 아직 구현되지 않았습니다.</Message>;
      default:
        return <Message>탭 기능을 선택하여 프로젝트 작업을 시작하세요.</Message>;
    }
  };

  if (loading) {
    return <LoadingContainer><Message>프로젝트 정보를 불러오는 중...</Message></LoadingContainer>;
  }

  if (error) {
    return <ContentContainer><ErrorMessage>프로젝트 정보를 불러오는 데 실패했습니다.</ErrorMessage></ContentContainer>;
  }

  if (!project) {
    return <ContentContainer><Message>프로젝트를 찾을 수 없습니다.</Message></ContentContainer>;
  }

  return (
    <PageWrapper>
      <ProjectHeaderContainer>
        <ProjectHeader>
          <ProjectName>{project.name}</ProjectName>
          <ProjectDescription>{project.description}</ProjectDescription>
        </ProjectHeader>
      </ProjectHeaderContainer>

      <ProjectDetailTabs activeTab={activeTab} onTabClick={handleTabClick} />

      <ContentContainer>
        {renderContent()}
      </ContentContainer>
    </PageWrapper>
  );
};

export default ProjectDetailPage;
