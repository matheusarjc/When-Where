import styled from "styled-components";

export const StyledButton = styled.button`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  background-color: #4bdf7f;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: rgb(17, 222, 89);
  }
`;
