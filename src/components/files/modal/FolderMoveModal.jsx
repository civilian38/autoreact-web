import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

// 자기 자신 및 하위 폴더를 제외하고 평탄화된 경로 리스트를 생성하는 유틸 함수
const flattenFolders = (node, excludeId, result = [], path = '') => {
  if (node.id === excludeId) return result;
  
  const currentPath = path ? `${path}/${node.name}` : node.name;
  result.push({ id: node.id, path: currentPath });
  
  if (node.subfolders) {
    node.subfolders.forEach(sub => {
      flattenFolders(sub, excludeId, result, currentPath);
    });
  }
  return result;
};

const FolderMoveModal = ({ isOpen, onClose, folder, rootFolder, onConfirm }) => {
  const [targetId, setTargetId] = useState('');
  const [options, setOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rootFolder && folder) {
      const flattened = flattenFolders(rootFolder, folder.id);
      setOptions(flattened);
      if (flattened.length > 0) {
        // Default to the first available folder (typically root)
        setTargetId(flattened[0].id.toString());
      }
    }
  }, [rootFolder, folder]);

  const handleSubmit = async () => {
    if (!targetId) {
      alert('이동할 대상 폴더를 선택해주세요.');
      return;
    }
    setIsSubmitting(true);
    await onConfirm(parseInt(targetId, 10));
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Move Folder" maxWidth="400px">
      <FieldWrapper>
        <Label>Select Destination Folder</Label>
        <Select 
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          disabled={isSubmitting}
        >
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.path}
            </option>
          ))}
        </Select>
      </FieldWrapper>
      <ButtonGroup>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>Move</Button>
      </ButtonGroup>
    </Modal>
  );
};

export default FolderMoveModal;
