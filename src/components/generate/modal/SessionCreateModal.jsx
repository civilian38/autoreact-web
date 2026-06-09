import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getApiDocs } from '@/services/apiDocsService';
import { getPages } from '@/services/pageService';
import { getFolderStructure } from '@/services/fileStructureService';
import { getDiscussionList } from '@/services/discussionService';
import { createSession } from '@/services/generationService';

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 250px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 8px 4px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
  color: ${({ theme }) => theme.text};
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
  margin: 16px 0;
`;

const TreeFolder = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.subtleText};
  margin-bottom: 4px;
`;

const SelectableFileTree = ({ folder, selectedFiles, onToggleFile, depth = 0 }) => {
  return (
    <div style={{ marginLeft: depth === 0 ? '0' : '16px', marginTop: '4px' }}>
      <TreeFolder>📁 {folder.name}</TreeFolder>
      {folder.files && folder.files.map(file => (
        <div key={file.id} style={{ marginLeft: '24px', marginBottom: '4px' }}>
          <CheckboxLabel>
            <input 
               type="checkbox" 
               checked={selectedFiles.includes(file.id)} 
               onChange={() => onToggleFile(file.id)}
            />
            📄 {file.name}
          </CheckboxLabel>
        </div>
      ))}
      {folder.subfolders && folder.subfolders.map(subfolder => (
        <SelectableFileTree 
           key={subfolder.id} 
           folder={subfolder} 
           selectedFiles={selectedFiles} 
           onToggleFile={onToggleFile} 
           depth={depth + 1}
        />
      ))}
    </div>
  );
};

const SessionCreateModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  
  const [apiDocs, setApiDocs] = useState([]);
  const [pages, setPages] = useState([]);
  const [fileStructure, setFileStructure] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApiDocs, setSelectedApiDocs] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDiscussions, setSelectedDiscussions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        getApiDocs(projectId),
        getPages(projectId),
        getFolderStructure(projectId),
        getDiscussionList(projectId)
      ]).then(([docsData, pagesData, fileData, discData]) => {
        setApiDocs(docsData || []);
        setPages(pagesData || []);
        setFileStructure(fileData || null);
        setDiscussions(discData || []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
        alert('Failed to load project resources.');
      });
      
      // Reset states on open
      setStep(1);
      setTitle('');
      setSelectedApiDocs([]);
      setSelectedPages([]);
      setSelectedFiles([]);
      setSelectedDiscussions([]);
    }
  }, [isOpen, projectId]);

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    setIsSubmitting(true);
    const payload = {
      title,
      related_apidocs: selectedApiDocs,
      related_pages: selectedPages,
      related_files: selectedFiles,
      related_discussions: selectedDiscussions
    };

    try {
      await createSession(projectId, payload);
      onSuccess();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400 && error.response.data.non_field_errors) {
         alert(error.response.data.non_field_errors[0]);
      } else {
         alert('Failed to create session. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (loading) return <p style={{color: 'var(--subtleText)'}}>Loading resources...</p>;

    switch (step) {
      case 1:
        return (
          <StepContainer>
            <Label>Step 1: Select API Documents</Label>
            {apiDocs.length === 0 && <p style={{color: 'var(--subtleText)'}}>No API Docs available.</p>}
            {apiDocs.map(doc => (
               <CheckboxLabel key={doc.id}>
                  <input 
                    type="checkbox" 
                    checked={selectedApiDocs.includes(doc.id)}
                    onChange={() => toggleSelection(doc.id, selectedApiDocs, setSelectedApiDocs)}
                  />
                  [{doc.http_method}] {doc.description || doc.url}
               </CheckboxLabel>
            ))}
          </StepContainer>
        );
      case 2:
        return (
          <StepContainer>
            <Label>Step 2: Select Pages</Label>
            {pages.length === 0 && <p style={{color: 'var(--subtleText)'}}>No Pages available.</p>}
            {pages.map(page => (
               <CheckboxLabel key={page.id}>
                  <input 
                    type="checkbox" 
                    checked={selectedPages.includes(page.id)}
                    onChange={() => toggleSelection(page.id, selectedPages, setSelectedPages)}
                  />
                  {page.url}
               </CheckboxLabel>
            ))}
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer>
            <Label>Step 3: Select Files</Label>
            {!fileStructure && <p style={{color: 'var(--subtleText)'}}>No Files available.</p>}
            {fileStructure && (
              <SelectableFileTree 
                folder={fileStructure} 
                selectedFiles={selectedFiles} 
                onToggleFile={(id) => toggleSelection(id, selectedFiles, setSelectedFiles)}
              />
            )}
          </StepContainer>
        );
      case 4:
        return (
          <StepContainer>
            <Label>Step 4: Select Discussions</Label>
            {discussions.length === 0 && <p style={{color: 'var(--subtleText)'}}>No Discussions available.</p>}
            {discussions.map(disc => (
               <CheckboxLabel key={disc.id}>
                  <input 
                    type="checkbox" 
                    checked={selectedDiscussions.includes(disc.id)}
                    onChange={() => toggleSelection(disc.id, selectedDiscussions, setSelectedDiscussions)}
                  />
                  {disc.title}
               </CheckboxLabel>
            ))}
          </StepContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Session" maxWidth="600px">
      <FormGroup>
        <Label>Session Title <span style={{color: '#DA3633'}}>*</span></Label>
        <Input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Enter session title" 
          maxLength={100}
        />
      </FormGroup>
      
      <Divider />
      
      {renderStepContent()}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <Button 
          variant="secondary" 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1 || isSubmitting}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={loading}>
            Next
          </Button>
        ) : (
          <Button 
             onClick={handleSubmit} 
             disabled={!title.trim() || isSubmitting || loading}
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default SessionCreateModal;
