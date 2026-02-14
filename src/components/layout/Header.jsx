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
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  z-index: 1000;
  height: 60px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
`;

const AuthButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ThemeToggleButton = styled.button`
    background: ${({ theme }) => theme.primary};
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    color: ${({ theme }) => theme.text};
    border-radius: 30px;
    cursor: pointer;
    font-size:0.8rem;
    padding: 0.6rem;
`;

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      <Logo to="/home">AutoReact</Logo>
      <Nav>
        {user ? (
          <AuthButton onClick={logout}>Logout</AuthButton>
        ) : (
          <NavLink to="/auth/login">Login</NavLink>
        )}
        <ThemeToggleButton onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </ThemeToggleButton>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
