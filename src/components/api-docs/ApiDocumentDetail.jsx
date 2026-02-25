import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  getApiDocDetail,
  updateApiDocDetail,
  deleteApiDoc
} from '@/services/apiDocsService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import UrlParameterLinkModal from './UrlParameterLinkModal';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BasicInfoForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
`;

const FullWidthInput = styled.div`
  grid-column: span 2;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
`;

const TabButton = styled.button`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.text : theme.subtleText};
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

const ParamList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ParamItem = styled.li`
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  flex-direction: column;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.subtleText};
`;

const HttpMethodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const ApiDocumentDetail = ({ documentId, onDelete, onUpdate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bodies'); // bodies, params

  // Edit States
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({});

  // Modals
  const [paramModalOpen, setParamModalOpen] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await getApiDocDetail(documentId);
      setData(detail);
      setInfoForm({
        url: detail.url,
        http_method: detail.http_method,
        description: detail.description
      });
    } catch (error) {
      console.error('Failed to fetch detail:', error);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleInfoSave = async () => {
    try {
      const updated = await updateApiDocDetail(documentId, infoForm);
      setData(prev => ({ ...prev, ...updated }));
      setIsEditingInfo(false);
      onUpdate(); // Notify parent list to refresh if needed
    } catch (error) {
      console.error('Update failed:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDeleteDoc = async () => {
    if (!window.confirm('이 API 문서를 삭제하시겠습니까?')) return;
    try {
      await deleteApiDoc(documentId);
      onDelete(documentId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <Container>Loading...</Container>;
  if (!data) return <Container>Error loading data.</Container>;

  return (
    <Container>
      <BasicInfoForm>
        <div>
          <Label>HTTP Method</Label>
          <Select
            value={infoForm.http_method}
            onChange={(e) => setInfoForm(prev => ({...prev, http_method: e.target.value}))}
            disabled={!isEditingInfo}
          >
            {HttpMethodOptions.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>URL</Label>
          <Input
            value={infoForm.url}
            onChange={(e) => setInfoForm(prev => ({...prev, url: e.target.value}))}
            disabled={!isEditingInfo}
          />
        </div>
        <FullWidthInput>
          <Label>Description</Label>
          <Textarea
            value={infoForm.description}
            onChange={(e) => setInfoForm(prev => ({...prev, description: e.target.value}))}
            disabled={!isEditingInfo}
            rows={3}
            style={{ minHeight: '80px' }}
          />
        </FullWidthInput>
        <FullWidthInput style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {isEditingInfo ? (
            <>
              <Button onClick={handleInfoSave}>저장</Button>
              <Button onClick={() => setIsEditingInfo(false)} style={{ background: '#6e7681', borderColor: '#6e7681' }}>취소</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditingInfo(true)}>기본 정보 수정</Button>
              <Button onClick={handleDeleteDoc} style={{ background: '#DA3633', borderColor: '#DA3633' }}>문서 삭제</Button>
            </>
          )}
        </FullWidthInput>
      </BasicInfoForm>

      <Tabs>
        <TabButton $active={activeTab === 'bodies'} onClick={() => setActiveTab('bodies')}>
          Request/Response Bodies
        </TabButton>
        <TabButton $active={activeTab === 'params'} onClick={() => setActiveTab('params')}>
          URL Parameters
        </TabButton>
      </Tabs>

      <TabContent>
        {activeTab === 'bodies' && (
          <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'transparent', border: '1px dashed #d0d7de', borderRadius: '6px', marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1f2328' }}>[구현 예정]</h3>
            <p style={{ margin: 0, color: '#57606a', fontSize: '0.95rem' }}>
              Request 및 Response Body의 CRUD 기능은 JSON 특화 편집기를 도입하여 추후 제공될 예정입니다.
            </p>
          </div>
        )}

        {activeTab === 'params' && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0 }}>Linked URL Parameters</h4>
              <Button onClick={() => setParamModalOpen(true)}>Manage Links</Button>
            </div>
            {data.url_parameters.length === 0 && <p style={{ color: '#888' }}>No linked parameters.</p>}
            <ParamList>
              {data.url_parameters.map(param => (
                <ParamItem key={param.id}>
                  <strong style={{ fontFamily: 'monospace', color: '#0969DA' }}>{param.parameter}</strong>
                  <span style={{ fontSize: '0.9rem', color: '#57606A' }}>{param.description}</span>
                </ParamItem>
              ))}
            </ParamList>
          </div>
        )}
      </TabContent>

      {/* Modals */}
      <UrlParameterLinkModal
        isOpen={paramModalOpen}
        onClose={() => setParamModalOpen(false)}
        docId={documentId}
        projectId={data.project_under}
        currentlyLinked={data.url_parameters}
        onSave={() => {
          setParamModalOpen(false);
          fetchDetail();
        }}
      />
    </Container>
  );
};

export default ApiDocumentDetail;
