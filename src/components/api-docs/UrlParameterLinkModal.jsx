import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getProjectUrlParameters, manageUrlParamRelation } from '@/services/apiDocsService';

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-height: 500px;
  overflow-y: hidden;
`;

const Section = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background-color: ${({ theme }) => theme.header.bg};
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const SectionBody = styled.div`
  padding: 12px;
  overflow-y: auto;
  flex: 1;
`;

const CheckItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder}40;
  &:last-child {
    border-bottom: none;
  }
`;

const ParamInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ParamLabel = styled.span`
  font-family: monospace;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const DescLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtleText};
`;

const Checkbox = styled.input`
  margin-top: 4px;
  cursor: pointer;
`;

const EmptyText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  margin: 20px 0;
`;

const UrlParameterLinkModal = ({ isOpen, onClose, docId, projectId, currentlyLinked, onSave }) => {
  const [allParams, setAllParams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Checkbox states
  const [checkedToAdd, setCheckedToAdd] = useState(new Set());
  const [checkedToPop, setCheckedToPop] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      const fetchParams = async () => {
        setLoading(true);
        try {
          const data = await getProjectUrlParameters(projectId);
          setAllParams(data);
        } catch (error) {
          console.error('Failed to fetch params:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchParams();
      setCheckedToAdd(new Set());
      setCheckedToPop(new Set());
    }
  }, [isOpen, projectId]);

  // Derived lists
  const linkedIds = new Set(currentlyLinked.map(p => p.id));
  const notLinkedParams = allParams.filter(p => !linkedIds.has(p.id));
  const linkedParams = allParams.filter(p => linkedIds.has(p.id));

  const toggleAdd = (id) => {
    const next = new Set(checkedToAdd);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedToAdd(next);
  };

  const togglePop = (id) => {
    const next = new Set(checkedToPop);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedToPop(next);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const payload = {
        to_add: Array.from(checkedToAdd),
        to_pop: Array.from(checkedToPop)
      };
      await manageUrlParamRelation(docId, payload);
      onSave();
    } catch (error) {
      console.error('Failed to update relations:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage URL Parameter Links" maxWidth="800px">
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading parameters...</p>
      ) : (
        <ListContainer>
          <Section>
            <SectionHeader>
              <SectionTitle>Available to Add</SectionTitle>
            </SectionHeader>
            <SectionBody>
              {notLinkedParams.length === 0 && <EmptyText>No available parameters.</EmptyText>}
              {notLinkedParams.map(param => (
                <CheckItem key={param.id}>
                  <Checkbox
                    type="checkbox"
                    checked={checkedToAdd.has(param.id)}
                    onChange={() => toggleAdd(param.id)}
                  />
                  <ParamInfo>
                    <ParamLabel>{param.parameter}</ParamLabel>
                    <DescLabel>{param.description}</DescLabel>
                  </ParamInfo>
                </CheckItem>
              ))}
            </SectionBody>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Currently Linked (Select to Remove)</SectionTitle>
            </SectionHeader>
            <SectionBody>
              {linkedParams.length === 0 && <EmptyText>No linked parameters.</EmptyText>}
              {linkedParams.map(param => (
                <CheckItem key={param.id}>
                  <Checkbox
                    type="checkbox"
                    checked={checkedToPop.has(param.id)}
                    onChange={() => togglePop(param.id)}
                  />
                  <ParamInfo>
                    <ParamLabel>{param.parameter}</ParamLabel>
                    <DescLabel>{param.description}</DescLabel>
                  </ParamInfo>
                </CheckItem>
              ))}
            </SectionBody>
          </Section>
        </ListContainer>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
        <Button onClick={onClose} style={{ background: '#6e7681', borderColor: '#6e7681' }}>Cancel</Button>
        <Button onClick={handleSave} disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
};

export default UrlParameterLinkModal;
