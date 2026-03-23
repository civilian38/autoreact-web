import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import { getDiscussionDetail } from '@/services/discussionService';

const SummaryContent = styled.div`
  white-space: pre-wrap;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
  padding: 1rem 0;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.button.dangerBg};
  padding: 1rem 0;
`;

const NoSummaryText = styled.div`
  color: ${({ theme }) => theme.subtleText};
  font-style: italic;
  padding: 1rem 0;
`;

const DiscussionSummaryModal = ({ isOpen, onClose, discussionId }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!isOpen || !discussionId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getDiscussionDetail(discussionId);
        setDetail(data);
      } catch (err) {
        console.error('Failed to fetch discussion detail:', err);
        setError('요약 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, discussionId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Discussion Summary" maxWidth="600px">
      {loading ? (
        <LoadingText>Loading summary...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : detail?.summary ? (
        <SummaryContent>{detail.summary}</SummaryContent>
      ) : (
        <NoSummaryText>요약 정보가 없습니다.</NoSummaryText>
      )}
    </Modal>
  );
};

export default DiscussionSummaryModal;
