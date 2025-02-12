import styled from "styled-components";

export const TimerContainer = styled.div`
  font-weight: bold;
  text-align: center;

  p {
    color: ${({ theme }) => theme.colors.textTitle};
  }
`;

export const TimeRemaining = styled.span`
  font-weight: 300;
  opacity: 40%;
`;

export const Timing = styled.span`
  padding: 0.5rem;
  background-color: #317b4b;
  border-radius: 0.5rem;
`;
