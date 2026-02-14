import React from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import ProjectList from '@/components/projects/ProjectList';
import Button from '@/components/ui/Button';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LoggedOutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: calc(100vh - 120px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const HomePage = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      {user ? (
        <ProjectList />
      ) : (
        <LoggedOutContainer>
          <Title>로그인하세요!</Title>
          <ButtonGroup>
            <Button to="/auth/login">로그인</Button>
            <Button to="/auth/signup">회원가입</Button>
          </ButtonGroup>
        </LoggedOutContainer>
      )}
    </PageContainer>
  );
};

export default HomePage;
