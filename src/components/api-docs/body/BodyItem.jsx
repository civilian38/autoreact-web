import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import JsonViewer from '@/components/api-docs/item/components/JsonViewer';
import JsonEditor from '@/components/api-docs/item/components/JsonEditor';
import {
  getRequestBodyDetail,
  deleteRequestBody,
  getResponseBodyDetail,
  deleteResponseBody,
  updateRequestBody,
  updateResponseBody
} from '@/services/apiDocsService';

const ItemContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: ${({ theme }) => theme.cardBg};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.background};
  &:hover {
    background-color: ${({ theme }) => theme.table?.headerBg || '#f0f0f0'};
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span`
  background-color: ${({ $status }) => {
    if ($status >= 200 && $status < 300) return '#2da44e';
    if ($status >= 400 && $status < 500) return '#d73a49';
    if ($status >= 500) return '#cb2431';
    return '#6a737d';
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ContentArea = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: flex-end;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.subtleText};
`;

const ReadOnlyField = styled.div`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  min-height: 38px;
  display: flex;
  align-items: center;
`;

const BodyItem = ({ type, summaryData, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    http_status: 200,
    example: {}
  });

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      let data;
      if (type === 'request') {
        data = await getRequestBodyDetail(summaryData.id);
      } else {
        data = await getResponseBodyDetail(summaryData.id);
      }
      setDetailData(data);
      setFormData({
        description: data.description || '',
        http_status: data.http_status || 200,
        example: type === 'request' ? (data.request_example || {}) : (data.response_example || {})
      });
    } catch (error) {
      console.error('Failed to fetch body detail', error);
      alert('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;

    if (!isExpanded && !detailData) {
      await fetchDetail();
    }
    setIsExpanded(!isExpanded);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setFormData({
      description: detailData.description || '',
      http_status: detailData.http_status || 200,
      example: type === 'request' ? (detailData.request_example || {}) : (detailData.response_example || {})
    });
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    setIsSaving(true);

    try {
      const payload = {
        description: formData.description,
      };

      if (type === 'response') {
        payload.http_status = parseInt(formData.http_status, 10);
        payload.response_example = formData.example;
        await updateResponseBody(summaryData.id, payload);
      } else {
        payload.request_example = formData.example;
        await updateRequestBody(summaryData.id, payload);
      }

      alert('저장되었습니다.');
      setIsEditing(false);
      await fetchDetail();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to save body', error);
      alert('수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete this ${type} body?`)) return;

    try {
      if (type === 'request') {
        await deleteRequestBody(summaryData.id);
      } else {
        await deleteResponseBody(summaryData.id);
      }
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete body', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <ItemContainer>
      <Header onClick={handleToggle}>
        <TitleArea>
          {type === 'response' && summaryData.http_status && (
            <StatusBadge $status={summaryData.http_status}>{summaryData.http_status}</StatusBadge>
          )}
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>
            {summaryData.description ? (
              summaryData.description.length >= 30
                ? `${summaryData.description.substring(0, 30)}...`
                : summaryData.description
            ) : '(No description)'}
          </span>
        </TitleArea>
        <div style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {isExpanded ? '▼' : '▶'}
        </div>
      </Header>

      {isExpanded && (
        <ContentArea>
          {isLoading ? (
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Loading details...</div>
          ) : detailData ? (
            <>
              {isEditing ? (
                <>
                  <ActionButtons>
                    <Button onClick={handleCancelClick} style={{ padding: '4px 12px', fontSize: '0.85rem', background: '#6e7681', borderColor: '#6e7681' }}>Cancel</Button>
                    <Button onClick={handleSaveClick} disabled={isSaving} style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </ActionButtons>

                  <FormGrid>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </FormGroup>
                    {type === 'response' && (
                      <FormGroup>
                        <Label>HTTP Status</Label>
                        <Input
                          type="number"
                          value={formData.http_status}
                          onChange={e => setFormData(prev => ({ ...prev, http_status: e.target.value }))}
                        />
                      </FormGroup>
                    )}
                  </FormGrid>

                  <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#57606A' }}>JSON Example (Edit)</div>
                  <JsonEditor
                    key={isEditing ? 'editor-active' : 'editor-inactive'}
                    initialContent={formData.example}
                    onChange={(newData) => setFormData(prev => ({ ...prev, example: newData }))}
                  />
                </>
              ) : (
                <>
                  <ActionButtons>
                    <Button onClick={handleEditClick} style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Edit Mode</Button>
                    <Button onClick={handleDeleteClick} style={{ padding: '4px 12px', fontSize: '0.85rem', background: '#DA3633', borderColor: '#DA3633' }}>Delete</Button>
                  </ActionButtons>

                  <FormGrid>
                    <FormGroup>
                      <Label>Description</Label>
                      <ReadOnlyField>{detailData.description || 'N/A'}</ReadOnlyField>
                    </FormGroup>
                    {type === 'response' && (
                      <FormGroup>
                        <Label>HTTP Status</Label>
                        <ReadOnlyField>{detailData.http_status}</ReadOnlyField>
                      </FormGroup>
                    )}
                  </FormGrid>

                  <JsonViewer
                    data={type === 'request' ? detailData.request_example : detailData.response_example}
                    title="JSON Example"
                  />
                </>
              )}
            </>
          ) : (
            <div style={{ color: '#d73a49', fontSize: '0.9rem' }}>Failed to load details.</div>
          )}
        </ContentArea>
      )}
    </ItemContainer>
  );
};

export default BodyItem;
