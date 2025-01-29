import styled from "styled-components";

export const StyledButton = styled.button`
  color: white;
  background-color: rgb(158, 171, 209);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: rgb(72, 92, 153);
  }
`;
