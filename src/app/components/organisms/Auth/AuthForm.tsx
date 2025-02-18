"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import Button from "../../atoms/Button/page";
import { ContainerBody, FormBase, RowContainer, Title } from "../../molecules/StylesPallete";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Continue } from "../../atoms/Button/Button";
import {
  BoxForm,
  GithubButton,
  GoogleButton,
  Input,
  Separator,
  SocialDiv,
  ToggleText,
} from "./style";

function AuthForm() {
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

export { AuthForm };
