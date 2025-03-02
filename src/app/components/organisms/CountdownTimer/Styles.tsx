import styled from "styled-components";

export const TimerContainer = styled.div`
  font-weight: bold;
  text-align: center;

  p {
    color: ${({ theme }) => theme.colors.textTitle};

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const TimeRemaining = styled.span`
  font-weight: 300;
  opacity: 40%;
`;

export const Timing = styled.span`
  padding: 1rem 1.5rem;
  background-color: #317b4b;
  border-radius: 3rem;
  display: inline-block;
  font-size: 2rem;

  /* Efeito Neon */
  box-shadow:
    0 0 10px ${({ theme }) => theme.colors.primary},
    0 0 20px ${({ theme }) => theme.colors.primary},
    0 0 30px ${({ theme }) => theme.colors.primary},
    0 0 40px ${({ theme }) => theme.colors.primary};

  /* Animação para pulsar */
  animation: neonGlow 1.5s infinite alternate;

  @keyframes neonGlow {
    from {
      box-shadow:
        0 0 5px ${({ theme }) => theme.colors.primary},
        0 0 10px ${({ theme }) => theme.colors.primary},
        0 0 15px ${({ theme }) => theme.colors.primary};
    }
    to {
      box-shadow:
        0 0 10px ${({ theme }) => theme.colors.primary},
        0 0 20px ${({ theme }) => theme.colors.primary},
        0 0 30px ${({ theme }) => theme.colors.primary};
    }
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;
