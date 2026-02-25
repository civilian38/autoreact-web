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
import BodyEditModal from './BodyEditModal';
import BodyItem from './body/BodyItem';

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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
  const [bodyAddModalState, setBodyAddModalState] = useState({ isOpen: false, type: 'request' });

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
    }
    finally {
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

  const openAddBodyModal = (type) => {
    setBodyAddModalState({ isOpen: true, type });
  };

  const closeBodyModal = () => {
    setBodyAddModalState({ isOpen: false, type: 'request' });
  };

  const handleBodySaved = () => {
    closeBodyModal();
    fetchDetail();
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
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader>
                <h4 style={{ margin: 0 }}>Request Bodies</h4>
                <Button onClick={() => openAddBodyModal('request')}>+ Add Request Body</Button>
              </SectionHeader>
              {data.request_bodies.length === 0 && <p style={{ color: '#888', fontSize: '0.9rem' }}>No request bodies defined.</p>}
              {data.request_bodies.map(body => (
                <BodyItem
                  key={body.id}
                  type="request"
                  summaryData={body}
                  onDelete={fetchDetail}
                  onUpdate={fetchDetail}
                />
              ))}
            </div>

            <div>
              <SectionHeader>
                <h4 style={{ margin: 0 }}>Response Bodies</h4>
                <Button onClick={() => openAddBodyModal('response')}>+ Add Response Body</Button>
              </SectionHeader>
              {data.response_bodies.length === 0 && <p style={{ color: '#888', fontSize: '0.9rem' }}>No response bodies defined.</p>}
              {data.response_bodies.map(body => (
                <BodyItem
                  key={body.id}
                  type="response"
                  summaryData={body}
                  onDelete={fetchDetail}
                  onUpdate={fetchDetail}
                />
              ))}
            </div>

            <BodyEditModal
              isOpen={bodyAddModalState.isOpen}
              onClose={closeBodyModal}
              type={bodyAddModalState.type}
              docId={documentId}
              onSave={handleBodySaved}
            />
          </div>
        )}

        {activeTab === 'params' && (
          <div style={{ marginTop: '24px' }}>
            <SectionHeader>
              <h4 style={{ margin: 0 }}>Linked URL Parameters</h4>
              <Button onClick={() => setParamModalOpen(true)}>Manage Links</Button>
            </SectionHeader>
            {data.url_parameters.length === 0 && <p style={{ color: '#888', fontSize: '0.9rem' }}>No linked parameters.</p>}
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
