import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import Button from '@/components/ui/Button';

const ProjectListContainer = styled.div`
  width: 100%;
  max-width: 1280px; /* Added for consistency */
  margin: 2rem auto;
  padding: 0 1rem; /* Added for spacing */
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const ProjectListUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  overflow: hidden;
`;

const ProjectListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};

  &:last-child {
    border-bottom: none;
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectName = styled(Link)`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  margin-bottom: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.subtleText};
  margin: 0;
`;

const ProjectDate = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.subtleText};
  white-space: nowrap;
  margin-left: 16px;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.1rem;
  padding: 2rem;
  color: ${({ theme }) => theme.subtleText};
`;

const ErrorMessage = styled(Message)`
  color: #ff4d4d;
`;

const ProjectList = () => {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <Message>프로젝트 목록을 불러오는 중...</Message>;
  }

  if (error) {
    return <ErrorMessage>프로젝트를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</ErrorMessage>;
  }

  return (
    <ProjectListContainer>
      <ListHeader>
        <Title>내 프로젝트</Title>
        <Button onClick={() => alert('새 프로젝트 생성 기능은 아직 구현되지 않았습니다.')}>
          New Project
        </Button>
      </ListHeader>
      
      {projects.length > 0 ? (
        <ProjectListUl>
          {projects.map((project) => (
            <ProjectListItem key={project.id}>
              <ProjectInfo>
                <ProjectName to={`/project/${project.id}`}>{project.name}</ProjectName>
                <ProjectDescription>{project.description}</ProjectDescription>
              </ProjectInfo>
              <ProjectDate>{new Date(project.created_at).toLocaleDateString()}</ProjectDate>
            </ProjectListItem>
          ))}
        </ProjectListUl>
      ) : (
        <EmptyStateContainer>
          <Message>생성된 프로젝트가 없습니다.</Message>
        </EmptyStateContainer>
      )}
    </ProjectListContainer>
  );
};

export default ProjectList;
