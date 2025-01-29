"use client";

import { useState } from "react";
import Button from "./components/atoms/Button/page";
import CountdownTimer from "./components/organisms/CountdownTimer/page";
import { Container, Title } from "./components/molecules/StylesPallete";

export default function HomePage() {
  const [eventDate, setEventDate] = useState<string | null>(null);

  const handleStartTimer = () => {
    const userDate = prompt("Digite a data do evento (YYYY-MM-DD HH:MM)");
    if (userDate) setEventDate(userDate);
  };

  return (
    <Container>
      <Title>Bem-vindo ao Cronômetro de Viagens</Title>
      <Button onClick={handleStartTimer}>Iniciar Contagem</Button>
      {eventDate && <CountdownTimer targetDate={eventDate} />}
    </Container>
  );
}
