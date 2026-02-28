import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';

const SidebarContainer = styled.div`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const PageList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 600px;
  overflow-y: auto;
`;

const PageItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.background : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $isImplemented }) => ($isImplemented ? '#2DA44E' : '#848D97')};
  flex-shrink: 0;
`;

const PageUrl = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PageListSidebar = ({ pages, selectedPageId, onSelect, onAddClick, loading }) => {
  return (
    <SidebarContainer>
      <ListContainer>
        <ListHeader>
          <span>Pages</span>
          <Button size="small" onClick={onAddClick}>
            + Add
          </Button>
        </ListHeader>
        <PageList>
          {loading ? (
            <PageItem style={{ justifyContent: 'center', color: '#848D97', cursor: 'default' }}>Loading...</PageItem>
          ) : pages.length === 0 ? (
            <PageItem style={{ justifyContent: 'center', color: '#848D97', cursor: 'default' }}>No pages found.</PageItem>
          ) : (
            pages.map(page => (
              <PageItem
                key={page.id}
                $isSelected={selectedPageId === page.id}
                onClick={() => onSelect(page.id)}
              >
                <StatusDot $isImplemented={page.is_implemented} title={page.is_implemented ? 'Implemented' : 'Not Implemented'} />
                <PageUrl title={page.url}>{page.url}</PageUrl>
              </PageItem>
            ))
          )}
        </PageList>
      </ListContainer>
    </SidebarContainer>
  );
};

export default PageListSidebar;
