import styled from "styled-components";

export const EventName = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.event};
  font-size: 3rem;

  @media (min-width: 768px) {
    font-size: 5rem;
  }
`;
