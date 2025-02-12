import styled from "styled-components";
import { FaLock } from "react-icons/fa";

export const StyledButton = styled.button`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  background-color: #4bdf7f;
  border: none;
  max-width: 400px;
  width: 130px;
  padding: 10px 15px;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: rgb(17, 222, 89);
  }
`;

export const Logout = styled(StyledButton)`
  width: 100%;
`;

export const Edit = styled(StyledButton)`
  width: 70%;
`;

export const Delete = styled(StyledButton)`
  background-color: red;
`;

export const Action = styled(StyledButton)`
  width: 180px;
`;

export const Blocked = styled(Action)`
  width: 180px;
  cursor: not-allowed;
  opacity: 50%;
  position: relative;
`;

export const LockedInputContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const LockedInput = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.border || "#ccc"};
  background: rgba(0, 0, 0, 0.4);
  color: ${({ theme }) => theme.colors.text || "#fff"};
  opacity: 0.8;
  pointer-events: none;
  filter: blur(1px);
  font-weight: bold;
`;

export const LockIcon = styled(FaLock)`
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text || "#fff"};
  font-size: 16px;
`;
