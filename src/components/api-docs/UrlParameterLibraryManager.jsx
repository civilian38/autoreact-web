import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getProjectUrlParameters,
  createUrlParameter,
  updateUrlParameter,
  deleteUrlParameter
} from '@/services/apiDocsService';

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.cardBg};
  overflow: hidden;
`;

const Header = styled.div`
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.header.bg};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  user-select: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const Content = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

const ParamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ParamItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBg};
`;

const ParamName = styled.span`
  font-family: monospace;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  min-width: 150px;
`;

const ParamDesc = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
`;

const StyledInput = styled(Input)`
  flex: 1;
`;

const UrlParameterLibraryManager = ({ projectId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [parameters, setParameters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit/Create State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ parameter: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchParameters = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProjectUrlParameters(projectId);
      setParameters(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch url parameters:', err);
      setError('파라미터 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isExpanded) {
      fetchParameters();
    }
  }, [isExpanded, fetchParameters]);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (param) => {
    setEditingId(param.id);
    setFormData({ parameter: param.parameter, description: param.description });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ parameter: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateUrlParameter(editingId, formData);
      } else {
        await createUrlParameter(projectId, formData);
      }
      await fetchParameters();
      handleCancel();
    } catch (err) {
      console.error('Failed to save parameter:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteUrlParameter(id);
      await fetchParameters();
    } catch (err) {
      console.error('Failed to delete parameter:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Header onClick={handleToggle}>
        <span>URL 파라미터 라이브러리 관리 {isExpanded ? '▴' : '▾'}</span>
      </Header>
      {isExpanded && (
        <Content>
          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!editingId && (
            <form onSubmit={handleSubmit}>
              <FormRow>
                <StyledInput
                  name="parameter"
                  placeholder="New Parameter (e.g. {id})"
                  value={formData.parameter}
                  onChange={handleInputChange}
                  required
                  style={{ flex: '0 0 200px' }}
                />
                <StyledInput
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '생성 중...' : '생성'}
                </Button>
              </FormRow>
            </form>
          )}

          <ParamList>
            {parameters.map(param => (
              <ParamItem key={param.id}>
                {editingId === param.id ? (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', gap: '12px', alignItems: 'center' }}>
                    <StyledInput
                      name="parameter"
                      value={formData.parameter}
                      onChange={handleInputChange}
                      required
                      style={{ width: '200px' }}
                    />
                    <StyledInput
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      style={{ flex: 1 }}
                    />
                    <ActionButtons>
                      <Button type="submit" disabled={isSubmitting}>저장</Button>
                      <Button type="button" onClick={handleCancel} style={{ backgroundColor: '#6e7681' }}>취소</Button>
                    </ActionButtons>
                  </form>
                ) : (
                  <>
                    <ParamName>{param.parameter}</ParamName>
                    <ParamDesc>{param.description}</ParamDesc>
                    <ActionButtons>
                      <Button onClick={() => handleEditClick(param)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>수정</Button>
                      <Button
                        onClick={() => handleDelete(param.id)}
                        style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: '#DA3633', borderColor: '#DA3633' }}
                      >
                        삭제
                      </Button>
                    </ActionButtons>
                  </>
                )}
              </ParamItem>
            ))}
          </ParamList>
        </Content>
      )}
    </Container>
  );
};

export default UrlParameterLibraryManager;
