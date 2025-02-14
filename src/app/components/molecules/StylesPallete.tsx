import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: bolder;
  color: ${({ theme }) => theme.colors.textTitle};
  font-size: 2.2rem;
  line-height: 2rem;
`;

export const FormBase = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RowContainer = styled.div`
  display: flex;
  gap: 1rem; /* Adiciona espaço entre os inputs */
  width: 100%; /* Para garantir que os elementos não quebrem linha */
  justify-content: center; /* Centraliza os inputs */
`;

export const ContainerBody = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden; /* Evita qualquer overflow extra */
`;

export const BoxStyled = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Box = styled.div`
  display: flex;
`;

export const BoxPosition = styled.div`
  position: relative;

  p {
    text-align: center;
  }
`;

export const Centralized = styled(Box)`
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
  }
`;

export const Box_1 = styled(Centralized)`
  position: relative;
  gap: 1rem;
`;
