import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createProject } from '@/services/projectService';
import Button from '@/components/ui/Button';

const PageContainer = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const Textarea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  margin-top: 1rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ProjectCreatePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instruction: '',
    base_api_url: '',
    base_web_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProject = await createProject(formData);
      navigate(`/project/${newProject.id}`);
    } catch (err) {
      setError('프로젝트 생성에 실패했습니다. 입력 내용을 확인해주세요.');
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Title>Create New Project</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Project Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="instruction">Instruction</Label>
          <Textarea
            id="instruction"
            name="instruction"
            value={formData.instruction}
            onChange={handleChange}
            placeholder="LLM에게 제공할 이 프로젝트에 대한 안내"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="base_web_url">Base Web URL</Label>
          <Input
            type="url"
            id="base_web_url"
            name="base_web_url"
            value={formData.base_web_url}
            onChange={handleChange}
            placeholder="http://example.com"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="base_api_url">Base API URL</Label>
          <Input
            type="url"
            id="base_api_url"
            name="base_api_url"
            value={formData.base_api_url}
            onChange={handleChange}
            placeholder="http://example.com/api"
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonContainer>
            <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
            </Button>
        </ButtonContainer>
      </Form>
    </PageContainer>
  );
};

export default ProjectCreatePage;
