import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const FolderRenameModal = ({ isOpen, onClose, folder, onConfirm }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('폴더 이름을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    await onConfirm(name);
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Folder" maxWidth="400px">
      <Input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New folder name"
        disabled={isSubmitting}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />
      <ButtonGroup>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
      </ButtonGroup>
    </Modal>
  );
};

export default FolderRenameModal;
