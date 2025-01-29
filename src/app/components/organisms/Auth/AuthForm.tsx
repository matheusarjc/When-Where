"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styled from "styled-components";
import Button from "../../atoms/Button/page";
import { FormBase, RowContainer } from "../../molecules/StylesPallete";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ToggleText = styled.p`
  margin-top: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;

export default function AuthForm() {
  const { user, login, signup } = useAuth();
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
    <Container>
      <h1>{isLogin ? "Login" : "Cadastro"}</h1>
      <FormBase onSubmit={handleSubmit}>
        {isLogin ? (
          ""
        ) : (
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
              placeholder="Nome"
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
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</Button>
      </FormBase>
      <ToggleText onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Ainda não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
      </ToggleText>
    </Container>
  );
}
