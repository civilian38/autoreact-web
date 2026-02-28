import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPageDetail, updatePage, deletePage } from '@/services/pageService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const DetailContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $isImplemented }) => ($isImplemented ? '#2DA44E' : '#848D97')};
  background-color: ${({ $isImplemented }) => ($isImplemented ? 'rgba(45, 164, 78, 0.1)' : 'rgba(132, 141, 151, 0.1)')};
  border: 1px solid ${({ $isImplemented }) => ($isImplemented ? 'rgba(45, 164, 78, 0.2)' : 'rgba(132, 141, 151, 0.2)')};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ReadOnlyText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 100px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
`;

const PageDetailViewer = ({ pageId, onDeleted, onUpdated }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ url: '', page_description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!pageId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getPageDetail(pageId);
        setPage(data);
        setEditForm({ url: data.url, page_description: data.page_description || '' });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to fetch page detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [pageId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = await updatePage(pageId, editForm);
      setPage(updatedData);
      onUpdated(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update page:', error);
      alert('Failed to update page.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await deletePage(pageId);
      onDeleted(pageId);
    } catch (error) {
      console.error('Failed to delete page:', error);
      alert('Failed to delete page.');
    }
  };

  if (loading) return <LoadingMessage>Loading page details...</LoadingMessage>;
  if (!page) return <LoadingMessage>Page not found.</LoadingMessage>;

  return (
    <DetailContainer>
      <Header>
        <Title>Page Details</Title>
        <StatusBadge $isImplemented={page.is_implemented}>
          {page.is_implemented ? 'Implemented' : 'Not Implemented'}
        </StatusBadge>
      </Header>

      {isEditing ? (
        <>
          <FieldGroup>
            <Label>URL</Label>
            <Input
              value={editForm.url}
              onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Page Description</Label>
            <Textarea
              rows={10}
              value={editForm.page_description}
              onChange={(e) => setEditForm(prev => ({ ...prev, page_description: e.target.value }))}
            />
          </FieldGroup>
          <ActionRow>
            <Button variant="danger" onClick={handleDelete} style={{ marginRight: 'auto' }}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => {
              setIsEditing(false);
              setEditForm({ url: page.url, page_description: page.page_description || '' });
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </ActionRow>
        </>
      ) : (
        <>
          <FieldGroup>
            <Label>URL</Label>
            <ReadOnlyText style={{ minHeight: 'auto' }}>{page.url}</ReadOnlyText>
          </FieldGroup>
          <FieldGroup>
            <Label>Page Description</Label>
            <ReadOnlyText>{page.page_description || 'No description provided.'}</ReadOnlyText>
          </FieldGroup>
          <ActionRow>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </ActionRow>
        </>
      )}
    </DetailContainer>
  );
};

export default PageDetailViewer;
