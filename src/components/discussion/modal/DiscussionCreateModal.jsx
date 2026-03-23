import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createDiscussion } from '@/services/discussionService';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.button.dangerBg};
  font-size: 0.85rem;
`;

const DiscussionCreateModal = ({ isOpen, onClose, projectId, onCreated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await createDiscussion(projectId, { title: title.trim() });
      setTitle('');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create discussion:', err);
      setError('Failed to create discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Discussion">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter discussion title"
            autoFocus
            disabled={loading}
          />
        </FormGroup>
        {error && <ErrorText>{error}</ErrorText>}
        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim() || loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default DiscussionCreateModal;
