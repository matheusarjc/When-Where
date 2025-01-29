import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

export const FormBase = styled.form`
  display: flex;
  flex-direction: column;
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem; /* Adiciona espaço entre os inputs */
  width: 100%; /* Para garantir que os elementos não quebrem linha */
  justify-content: center; /* Centraliza os inputs */
`;
