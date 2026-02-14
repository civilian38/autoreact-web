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

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nickname: '',
    bio: '',
    gemini_key_encrypted: '',
  });
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        <Input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <Input type="text" name="nickname" placeholder="Nickname" onChange={handleChange} required />
        <Input type="text" name="bio" placeholder="Bio" onChange={handleChange} />
        <Input type="text" name="gemini_key_encrypted" placeholder="Gemini API Key" onChange={handleChange} required />
        <Button type="submit">Sign Up</Button>
        <RedirectText>
          Already have an account? <Link to="/auth/login">Log In</Link>
        </RedirectText>
      </Form>
    </FormContainer>
  );
};

export default SignupPage;
