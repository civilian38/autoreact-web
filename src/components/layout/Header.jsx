import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center;
  padding: 0 2rem;
  background-color: ${({ theme }) => theme.header.bg};
  border-bottom: 1px solid ${({ theme }) => theme.header.border};
  z-index: 1000;
  height: 60px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: ${({ theme }) => theme.header.text};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.cardBorder};
    text-decoration: none;
  }
`;

const AuthButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.cardBorder};
    text-decoration: none;
  }
`;

const ThemeToggleButton = styled.button`
    background: none;
    border: 1px solid ${({ theme }) => theme.cardBorder};
    color: ${({ theme }) => theme.text};
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 5px 16px;
`;

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/home">AutoReact</Logo>
        <Nav>
          {user ? (
            <AuthButton onClick={logout}>Logout</AuthButton>
          ) : (
            <AuthLink to="/auth/login">Login</AuthLink>
          )}
          <ThemeToggleButton onClick={toggleTheme}>
            {theme === 'light' ? 'Dark' : 'Light'}
          </ThemeToggleButton>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
