"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styled from "styled-components";
import Button from "../../atoms/Button/page";
import { ContainerBody, FormBase, RowContainer, Title } from "../../molecules/StylesPallete";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Continue } from "../../atoms/Button/Button";

const Input = styled.input`
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

const ToggleText = styled.p`
  margin-top: 10px;
  font-size: small;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;

const BoxForm = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundBox};
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 0; /* Padrão para mobile */

  @media (min-width: 768px) {
    padding: 2rem 0; /* Apenas no desktop */
  }
`;

const SocialDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SocialButton = styled.button`
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

const GoogleButton = styled(SocialButton)`
  background-color: white;
  color: black;
`;

const GithubButton = styled(SocialButton)`
  background-color: #333;
  color: white;
`;

const Separator = styled.div`
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

export default function AuthForm() {
  const { user, login, signup, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && pathname === "/") {
      router.push("/Home");
    }
  }, [user, router, pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(email, password, username, name);
    }
  };

  return (
    <ContainerBody>
      <BoxForm>
        <Title>{isLogin ? "Get your trip plans with you!" : "Create an Account"}</Title>
        <p style={{ color: "gray", fontSize: "14px", marginBottom: "20px" }}>
          {isLogin ? "Log in or sign up" : "Sign up to get started"}
        </p>
        <FormBase onSubmit={handleSubmit}>
          {!isLogin && (
            <RowContainer>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </RowContainer>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Continue type="submit">{isLogin ? "Continue" : "Sign Up"}</Continue>
        </FormBase>

        <Separator>Or</Separator>

        <SocialDiv>
          <GoogleButton onClick={loginWithGoogle}>
            <FcGoogle size={22} />
            Continue with Google
          </GoogleButton>
          <GithubButton onClick={loginWithGithub}>
            <FaGithub size={22} />
            Continue with GitHub
          </GithubButton>
        </SocialDiv>

        <ToggleText onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Ainda não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
        </ToggleText>
      </BoxForm>
    </ContainerBody>
  );
}
