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

export const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: bolder;
  color: gray;
  font-size: 0.8rem;
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

export const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    font-size: 14px;
    color: gray;
  }

  &:focus {
    outline: none;
    border: 2px solid ${({ theme }) => theme.colors.greenLight};
    box-shadow: 0px 0px 5px rgba(17, 222, 89, 0.5);
  }
`;

export const ToggleText = styled.p`
  margin-top: 10px;
  font-size: small;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;

export const BoxForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 0; /* Padrão para mobile */

  @media (min-width: 768px) {
    padding: 2rem 0; /* Apenas no desktop */
  }
`;

export const SocialDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SocialButton = styled.button`
  width: 100%;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  gap: 10px;
`;

export const GoogleButton = styled(SocialButton)`
  background-color: white;
  color: black;
`;

export const GithubButton = styled(SocialButton)`
  background-color: #333;
  color: white;
`;

export const Separator = styled.div`
  text-align: center;
  margin: 10px 0;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 50%;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.white};
    margin: 0 10px;
  }
`;
