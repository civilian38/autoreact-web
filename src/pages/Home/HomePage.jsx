import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 120px); // Full height minus header
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #535bf2;
    text-decoration: none;
  }
`;

const HomePage = () => {
  const { user } = useAuth();

  return (
    <HomeContainer>
      {user ? (
        <Title>반갑습니다!</Title>
      ) : (
        <>
          <Title>로그인하세요!</Title>
          <ButtonGroup>
            <StyledLink to="/auth/login">로그인</StyledLink>
            <StyledLink to="/auth/signup">회원가입</StyledLink>
          </ButtonGroup>
        </>
      )}
    </HomeContainer>
  );
};

export default HomePage;
