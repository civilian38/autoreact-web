import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
`;

const SectionHeader = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.table.headerBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const SectionBody = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FullWidthSectionBody = styled(SectionBody)`
  display: block;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
`;

const Value = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.subtleText};
  word-break: break-all;
`;

const PreformattedValue = styled.pre`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  background-color: ${({ theme }) => theme.background};
  padding: 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
`;

const DangerZone = styled(Section)`
  border-color: #DA3633;
`;

const DangerSectionHeader = styled(SectionHeader)`
  background-color: #DA363320;
  border-bottom-color: #DA3633;
  h3 {
    color: #DA3633;
  }
`;

const DangerSectionBody = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  div {
    flex-grow: 1;
  }

  h4 {
    margin: 0 0 4px 0;
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.subtleText};
  }

  button {
    flex-shrink: 0;
  }
`;

const ModalText = styled.p`
  margin-bottom: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.subtleText};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ProjectSettings = ({ project, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        instruction: project.instruction || '',
        base_api_url: project.base_api_url || '',
        base_web_url: project.base_web_url || '',
      });
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update project.');
    }
  };

  const handleCancel = () => {
    if (project) {
        setFormData({
            name: project.name,
            description: project.description,
            instruction: project.instruction,
            base_api_url: project.base_api_url,
            base_web_url: project.base_web_url,
        });
    }
    setIsEditing(false);
  };
  
  const handleConfirmDelete = async () => {
    try {
        await onDelete();
        // The hook will navigate away on success
    } catch (error) {
        alert('Failed to delete project.');
        setIsDeleteModalOpen(false);
    }
  };

  if (!project) return null;

  return (
    <>
      <SettingsContainer>
        <Section>
          <SectionHeader>
            <h3>Project Details</h3>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <ButtonGroup>
                <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </ButtonGroup>
            )}
          </SectionHeader>
          <SectionBody>
            <FormGroup>
              <Label>Project Name</Label>
              {isEditing ? <Input name="name" value={formData.name} onChange={handleInputChange} /> : <Value>{project.name}</Value>}
            </FormGroup>
            <FormGroup>
              <Label>Created By</Label>
              <Value>{project.created_by.username}</Value>
            </FormGroup>
             <FormGroup>
              <Label>Base Web URL</Label>
              {isEditing ? <Input name="base_web_url" value={formData.base_web_url} onChange={handleInputChange} /> : <Value>{project.base_web_url}</Value>}
            </FormGroup>
            <FormGroup>
              <Label>Base API URL</Label>
              {isEditing ? <Input name="base_api_url" value={formData.base_api_url} onChange={handleInputChange} /> : <Value>{project.base_api_url}</Value>}
            </FormGroup>
            <FormGroup className="full-width">
              <Label>Description</Label>
              {isEditing ? <Textarea name="description" value={formData.description} onChange={handleInputChange} /> : <Value>{project.description}</Value>}
            </FormGroup>
            <FormGroup className="full-width">
              <Label>Instruction</Label>
              {isEditing ? <Textarea name="instruction" rows={10} value={formData.instruction} onChange={handleInputChange} /> : <Value style={{ whiteSpace: 'pre-wrap' }}>{project.instruction}</Value>}
            </FormGroup>
          </SectionBody>
        </Section>

        <Section>
            <SectionHeader>
                <h3>Handover Context</h3>
            </SectionHeader>
            <FullWidthSectionBody>
                <PreformattedValue>{project.handover_text || 'Not set'}</PreformattedValue>
            </FullWidthSectionBody>
        </Section>

        <Section>
            <SectionHeader>
                <h3>To-Do Request</h3>
            </SectionHeader>
            <FullWidthSectionBody>
                <Value>{project.to_do_request || 'Not set'}</Value>
            </FullWidthSectionBody>
        </Section>

        {isEditing && (
          <DangerZone>
            <DangerSectionHeader><h3>Danger Zone</h3></DangerSectionHeader>
            <DangerSectionBody>
                <div>
                    <h4>Delete this project</h4>
                    <p>Once you delete a project, there is no going back. Please be certain.</p>
                </div>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Project</Button>
            </DangerSectionBody>
          </DangerZone>
        )}
      </SettingsContainer>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
        <ModalText>
          This action cannot be undone. This will permanently delete the <strong>{project.name}</strong> project.
        </ModalText>
        <ModalText>
          Please type <strong>{project.name}</strong> to confirm.
        </ModalText>
        <Input 
          type="text" 
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        <Button 
          variant="danger" 
          onClick={handleConfirmDelete}
          disabled={deleteConfirmation !== project.name}
          style={{ width: '100%' }}
        >
          I understand the consequences, delete this project
        </Button>
      </Modal>
    </>
  );
};

export default ProjectSettings;
