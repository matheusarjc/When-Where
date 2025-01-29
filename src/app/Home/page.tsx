"use client";

import { useState, useEffect } from "react";
import Button from "../components/atoms/Button/page";
import CountdownTimer from "../components/organisms/CountdownTimer/page";
import { Container, Title } from "../components/molecules/StylesPallete";
import { useAuth } from "@/context/AuthContext"; // 🚀 Importa autenticação
import { useRouter } from "next/navigation";
import { styled } from "styled-components";

const ToggleText = styled.p`
  margin-top: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;

export default function HomePage() {
  const [eventDate, setEventDate] = useState<string | null>(null);
  const { user, logout } = useAuth(); // 🚀 Adiciona o logout
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Se não estiver logado, redireciona para login
    }
  }, [user, router]);

  const handleStartTimer = () => {
    const userDate = prompt("Digite a data do evento (YYYY-MM-DD HH:MM)");
    if (userDate) setEventDate(userDate);
  };

  return (
    <Container>
      <Title>Bem-vindo ao Cronômetro de Viagens</Title>
      <p>Logado como: {user?.email}</p> {/* Mostra o email do usuário autenticado */}
      <Button onClick={handleStartTimer}>Iniciar Contagem</Button>
      {eventDate && <CountdownTimer targetDate={eventDate} />}
      <Button onClick={logout}>Sair</Button> {/* 🚀 Botão de logout */}
    </Container>
  );
}
