import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 1000;
  min-width: 160px;
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.button.secondaryHoverBg};
  }
`;

const ContextMenu = ({ x, y, options, onClose }) => {
  const menuRef = useRef();

  // Handle click outside to close the context menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <MenuContainer ref={menuRef} x={x} y={y}>
      {options.map((opt, idx) => (
        <MenuItem key={idx} onClick={() => { opt.action(); onClose(); }}>
          {opt.label}
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

export default ContextMenu;
