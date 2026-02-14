import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid;
  border-radius: 6px;
  appearance: none;
  text-decoration: none; /* Remove underline from links */
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);

  background-color: ${({ theme }) => theme.button.primaryBg};
  color: ${({ theme }) => theme.button.primaryText};
  border-color: ${({ theme }) => theme.button.primaryBorder};
  box-shadow: ${({ theme }) => theme.button.primaryShadow};

  &:hover {
    background-color: ${({ theme }) => theme.button.primaryHoverBg};
    border-color: ${({ theme }) => theme.button.primaryHoverBorder};
    text-decoration: none; /* Ensure no underline on hover */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledButton = styled.button`
  ${buttonStyles}
`;

const StyledLinkButton = styled(Link)`
  ${buttonStyles}
`;


const Button = ({ children, to, ...props }) => {
  if (to) {
    return <StyledLinkButton to={to} {...props}>{children}</StyledLinkButton>;
  }
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
