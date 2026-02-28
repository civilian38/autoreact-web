import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const GuideText = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.subtleText};
  margin: 0;
  line-height: 1.4;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PageCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({ url: url.trim(), page_description: description.trim() });
      setUrl('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Page" maxWidth="600px">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>URL</Label>
          <GuideText>
            프로젝트 base URL 다음 경로(예: /project/...)부터 입력해도 자동으로 완성됩니다.<br />
            예시: http://example.com/project/{"{project_id}"}/
          </GuideText>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter page URL (e.g. /home, /project/{id})"
            required
            autoFocus
          />
        </FormGroup>
        <FormGroup>
          <Label>Page Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of this page's requirements..."
            rows={5}
          />
        </FormGroup>
        <ActionRow>
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting || !url.trim()}>
            {submitting ? 'Creating...' : 'Create'}
          </Button>
        </ActionRow>
      </Form>
    </Modal>
  );
};

export default PageCreateModal;
