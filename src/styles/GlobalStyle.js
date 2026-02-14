import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    line-height: 1.5;
    font-weight: 400;
    margin: 0;
    min-height: 100vh;
    transition: background-color 0.25s linear, color 0.25s linear;
  }

  #root {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem; /* Adjusted padding */
    text-align: left; /* Changed from center to left */
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
`;

export default GlobalStyle;
