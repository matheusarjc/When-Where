"use client";

import { useState, useEffect } from "react";
import Button from "../components/atoms/Button/page";
import CountdownTimer from "../components/organisms/CountdownTimer/page";
import { ContainerBody, Title } from "../components/molecules/StylesPallete";
import { useAuth } from "@/context/AuthContext"; // 🚀 Importa autenticação
import { useRouter } from "next/navigation";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import BoxFlexed from "../components/molecules/DivsPallete";

export default function HomePage() {
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string | null>("Meu Evento");
  const { user, logout } = useAuth(); // 🚀 Adiciona o logout
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Se não estiver logado, redireciona para login
    } else {
      fetchEventDate();
    }
  }, [user, router]);

  const fetchEventDate = async () => {
    if (!user) return;
    const eventRef = doc(db, "events", user.uid);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      setEventDate(eventSnap.data().date);
      setEventName(eventSnap.data().name);
    }
  };

  // Salvar eventos
  const saveEventDate = async (date: string, p0?: string) => {
    if (!user) return;

    const eventRef = doc(db, "events", user.uid);
    await setDoc(eventRef, { date });
    setEventDate(date);
  };

  const handleEditDate = async () => {
    const newDate = prompt("Digite a nova data do evento (YYYY-MM-DD HH:MM)", eventDate || "");
    if (newDate && user) {
      const eventRef = doc(db, "events", user.uid);
      await updateDoc(eventRef, { date: newDate });
      setEventDate(newDate);
    }
  };

  const handleEditName = async () => {
    const newName = prompt("Digite o novo nome do evento", eventName || "Meu Evento");
    if (newName && user) {
      const eventRef = doc(db, "events", user.uid);
      await updateDoc(eventRef, { name: newName });
      setEventName(newName);
    }
  };

  const handleDeleteEvent = async () => {
    if (!user) return;
    const confirmDelete = confirm("Tem certeza que deseja excluir este evento?");
    if (confirmDelete) {
      const eventRef = doc(db, "events", user.uid);
      await deleteDoc(eventRef);
      setEventDate(null);
      setEventName(null);
    }
  };

  const handleStartTimer = () => {
    const userDate = prompt("Digite a data do evento (YYYY-MM-DD HH:MM)");
    if (userDate) {
      saveEventDate(userDate);
    }
  };

  return (
    <ContainerBody>
      <Title>Bem-vindo ao Cronômetro de Viagens</Title>
      <p>Logado como: {user?.email}</p> {/* Mostra o email do usuário autenticado */}
      {eventName && <h2>Evento: {eventName}</h2>}
      {eventDate && <CountdownTimer targetDate={eventDate} />}
      <BoxFlexed flexDirection={"column"}>
        <Button onClick={handleStartTimer}>Criar Evento Padrão (Teste)</Button>
        <Button onClick={handleEditDate}>Editar Data do Evento</Button>
        <Button onClick={handleEditName}>Editar Nome do Evento</Button>
        <Button onClick={handleDeleteEvent}>Excluir Evento</Button>
        <Button onClick={logout}>Sair</Button>
      </BoxFlexed>
    </ContainerBody>
  );
}
