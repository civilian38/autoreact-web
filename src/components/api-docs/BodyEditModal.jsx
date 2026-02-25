import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Editor from '@monaco-editor/react';
import {
  createRequestBody,
  updateRequestBody,
  createResponseBody,
  updateResponseBody
} from '@/services/apiDocsService';

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.9rem;
`;

const ErrorText = styled.div`
  color: #d73a49;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const EditorWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.inputBg};
`;

const BodyEditModal = ({ isOpen, onClose, type, docId, initialData, onSave }) => {
  const [description, setDescription] = useState('');
  const [httpStatus, setHttpStatus] = useState(200);
  const [jsonContent, setJsonContent] = useState('{\n  \n}');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDescription(initialData.description || '');
        setHttpStatus(initialData.http_status || 200);
        const example = type === 'request' ? initialData.request_example : initialData.response_example;
        setJsonContent(JSON.stringify(example || {}, null, 2));
      } else {
        setDescription('');
        setHttpStatus(200);
        setJsonContent('{\n  \n}');
      }
      setJsonError(null);
    }
  }, [isOpen, initialData, type]);

  const handleEditorChange = (value) => {
    setJsonContent(value);
    setJsonError(null);
  };

  const handleSave = async () => {
    // Validate JSON
    let parsedJson = {};
    try {
      parsedJson = JSON.parse(jsonContent);
    } catch (e) {
      setJsonError('Invalid JSON format. Please check your syntax.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        description,
      };

      if (type === 'response') {
        payload.http_status = parseInt(httpStatus, 10);
        payload.response_example = parsedJson;
      } else {
        payload.request_example = parsedJson;
      }

      if (initialData) {
        // Update
        if (type === 'request') await updateRequestBody(initialData.id, payload);
        else await updateResponseBody(initialData.id, payload);
      } else {
        // Create
        if (type === 'request') await createRequestBody(docId, payload);
        else await createResponseBody(docId, payload);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save body:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${initialData ? 'Edit' : 'Add'} ${type === 'request' ? 'Request' : 'Response'} Body`}
    >
      <FormGroup>
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Success response"
        />
      </FormGroup>

      {type === 'response' && (
        <FormGroup>
          <Label>HTTP Status</Label>
          <Input
            type="number"
            value={httpStatus}
            onChange={(e) => setHttpStatus(e.target.value)}
          />
        </FormGroup>
      )}

      <FormGroup>
        <Label>JSON Body Example</Label>
        <EditorWrapper>
          <Editor
            height="300px"
            defaultLanguage="json"
            value={jsonContent}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              formatOnPaste: true,
              formatOnType: true,
              scrollBeyondLastLine: false,
              fontSize: 14,
              tabSize: 2,
            }}
          />
        </EditorWrapper>
        {jsonError && <ErrorText>{jsonError}</ErrorText>}
      </FormGroup>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button onClick={onClose} style={{ background: '#6e7681' }}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Modal>
  );
};

export default BodyEditModal;
