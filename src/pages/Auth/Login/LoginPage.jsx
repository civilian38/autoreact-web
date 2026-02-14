import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem;
  border-radius: 6px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #535bf2;
  }
`;

const RedirectText = styled.p`
  text-align: center;
  margin-top: 1rem;
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
        <RedirectText>
          Don't have an account? <Link to="/auth/signup">Sign Up</Link>
        </RedirectText>
      </Form>
    </FormContainer>
  );
};

export default LoginPage;
