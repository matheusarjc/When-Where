"use client";

import { useState, useEffect } from "react";
import Button from "../components/atoms/Button/page";
import ModalStep from "../components/molecules/ModalStep";
import CountdownTimer from "../components/organisms/CountdownTimer/page";
import {
  Box_1,
  BoxPosition,
  Centralized,
  Container,
  Title,
} from "../components/molecules/StylesPallete";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { EventName } from "./StylePage";
import {
  Action,
  Blocked,
  LockedInput,
  LockedInputContainer,
  LockIcon,
  Logout,
} from "../components/atoms/Button/Button";

export default function HomePage() {
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<"no-event" | "active" | "expired">("no-event");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redireciona para login se não estiver autenticado
    } else {
      fetchEventDate();
    }
  }, [user, router]);

  // 🔥 Função para buscar o evento no Firebase
  const fetchEventDate = async () => {
    if (!user) return;
    const eventRef = doc(db, "events", user.uid);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      const eventData = eventSnap.data();
      setEventDate(eventData.date);
      setEventName(eventData.name);
    }
  };

  // 🔥 Salvar Evento no Firestore (Nome e Data)
  const saveEvent = async (name: string, date: string) => {
    if (!user) return;

    const eventRef = doc(db, "events", user.uid);
    await setDoc(eventRef, { name, date });

    setEventName(name);
    setEventDate(date);
  };

  useEffect(() => {
    if (eventDate) {
      const eventTime = new Date(eventDate).getTime();
      const currentTime = new Date().getTime();

      setEventStatus(currentTime >= eventTime ? "expired" : "active");
    } else {
      setEventStatus("no-event");
    }
  }, [eventDate]);

  const handleEditEvent = async (newName: string, newDate: string) => {
    if (!user) return;
    const eventRef = doc(db, "events", user.uid);
    await updateDoc(eventRef, { name: newName, date: newDate });

    setEventName(newName);
    setEventDate(newDate);
  };

  const handleDeleteEvent = async () => {
    if (!user) return;
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      const eventRef = doc(db, "events", user.uid);
      await deleteDoc(eventRef);
      setEventName(null);
      setEventDate(null);
      setEventStatus("no-event");
    }
  };

  return (
    <Container>
      <BoxPosition>
        <Title>Bem-vindo ao Cronômetro de Viagens</Title>
        <p>Logado como: {user?.displayName}</p>

        <Centralized>
          {eventName && <EventName>{eventName}</EventName>}
          {eventDate && <CountdownTimer targetDate={eventDate} />}
        </Centralized>
      </BoxPosition>

      <Box_1>
        <Action onClick={() => setIsModalOpen(true)}>
          {eventStatus === "no-event"
            ? "Create an Event!"
            : eventStatus === "active"
              ? "Edit Event"
              : eventStatus === "expired"
                ? "Create a new Event!"
                : "Edit Event"}
        </Action>
        <LockedInputContainer>
          <LockIcon />
          <LockedInput disabled> Manage your Trip!</LockedInput>
        </LockedInputContainer>
      </Box_1>
      <Logout onClick={logout}>Logout</Logout>
      {/* 🔥 MODAL COM STEPS PARA CRIAR/EDITAR EVENTO */}
      <ModalStep
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        isEditMode={eventStatus === "active"}
        initialName={eventName || ""}
        initialDate={eventDate || ""}
      />
    </Container>
  );
}
