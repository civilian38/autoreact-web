import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const getButtonStyles = (variant, theme) => {
  switch (variant) {
    case 'danger':
      return css`
        background-color: ${theme.button.dangerBg};
        color: ${theme.button.dangerText};
        border-color: ${theme.button.dangerBorder};
        box-shadow: ${theme.button.dangerShadow || 'none'};
        &:hover:not(:disabled) {
          background-color: ${theme.button.dangerHoverBg};
          border-color: ${theme.button.dangerHoverBorder};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.button.secondaryBg};
        color: ${theme.button.secondaryText};
        border-color: ${theme.button.secondaryBorder};
        box-shadow: ${theme.button.secondaryShadow || 'none'};
        &:hover:not(:disabled) {
          background-color: ${theme.button.secondaryHoverBg};
          border-color: ${theme.button.secondaryHoverBorder};
        }
      `;
    case 'primary':
    default:
      return css`
        background-color: ${theme.button.primaryBg};
        color: ${theme.button.primaryText};
        border-color: ${theme.button.primaryBorder};
        box-shadow: ${theme.button.primaryShadow};
        &:hover:not(:disabled) {
          background-color: ${theme.button.primaryHoverBg};
          border-color: ${theme.button.primaryHoverBorder};
        }
      `;
  }
};

const baseButtonStyles = css`
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

  ${({ $variant, theme }) => getButtonStyles($variant, theme)}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledButton = styled.button`
  ${baseButtonStyles}
`;

const StyledLinkButton = styled(Link)`
  ${baseButtonStyles}
`;

const Button = ({ children, to, variant = 'primary', ...props }) => {
  if (to) {
    return <StyledLinkButton to={to} $variant={variant} {...props}>{children}</StyledLinkButton>;
  }
  return <StyledButton $variant={variant} {...props}>{children}</StyledButton>;
};

export default Button;
