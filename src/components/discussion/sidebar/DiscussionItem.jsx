import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.button.secondaryHoverBg : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.button.secondaryHoverBg : theme.button.secondaryBg)};
  }

  /* Hover 시에만 Summary 버튼 노출 */
  .summary-btn {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  &:hover .summary-btn {
    opacity: 1;
    pointer-events: auto;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
`;

const TitleText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OccupiedDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #E3B341; /* 황색 점 */
  flex-shrink: 0;
`;

const ActionWrapper = styled.div`
  flex-shrink: 0;
  margin-left: 0.5rem;
`;

const DiscussionItem = ({ discussion, isSelected, onClick, onShowSummary }) => {
  const handleSummaryClick = (e) => {
    e.stopPropagation();
    onShowSummary();
  };

  return (
    <ItemContainer $isSelected={isSelected} onClick={onClick}>
      <TitleWrapper>
        <TitleText title={discussion.title}>{discussion.title}</TitleText>
        {discussion.is_occupied && <OccupiedDot title="Occupied" />}
      </TitleWrapper>
      <ActionWrapper>
        <Button 
          className="summary-btn" 
          variant="secondary" 
          onClick={handleSummaryClick}
          style={{ padding: '2px 8px', fontSize: '0.8rem' }}
        >
          요약 보기
        </Button>
      </ActionWrapper>
    </ItemContainer>
  );
};

export default DiscussionItem;
