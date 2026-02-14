import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const Main = styled.main`
  width: 100%;
  padding-top: 60px; // Height of the header
`;

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  );
};

export default Layout;
