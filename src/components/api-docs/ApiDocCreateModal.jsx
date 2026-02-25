import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.9rem;
`;

const HttpMethodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const ApiDocCreateModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    http_method: 'GET',
    url: 'api/',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        http_method: 'GET',
        url: 'api/',
        description: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.url) {
      alert('URL을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        query_params: {},
        url_parameters: [],
        request_headers: {}
      });
      onClose();
    } catch (error) {
      console.error('Failed to create API doc', error);
      alert('API 문서 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create API Document">
      <FormGroup>
        <Label>HTTP Method</Label>
        <Select name="http_method" value={formData.http_method} onChange={handleChange}>
          {HttpMethodOptions.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>URL</Label>
        <Input
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="e.g. api/users/"
        />
        <p style={{ fontSize: '0.8rem', color: '#57606A', marginTop: '4px' }}>
          * `api/` 로 시작하는 URL을 입력해주세요.
        </p>
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of this API"
          rows={3}
        />
      </FormGroup>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
        <Button onClick={onClose} style={{ background: '#6e7681', borderColor: '#6e7681' }}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </Modal>
  );
};

export default ApiDocCreateModal;
