import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import UrlParameterLibraryManager from './UrlParameterLibraryManager';
import ApiDocumentList from './ApiDocumentList';

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ApiDocsTab = ({ projectId: propProjectId }) => {
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId;

  if (!projectId) {
    return <div>Project ID is missing.</div>;
  }

  return (
    <TabContainer>
      <Section>
        <UrlParameterLibraryManager projectId={projectId} />
      </Section>
      <Section>
        <ApiDocumentList projectId={projectId} />
      </Section>
    </TabContainer>
  );
};

export default ApiDocsTab;
