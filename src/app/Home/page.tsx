"use client";

import { useState, useEffect, useRef } from "react";
import ModalStep from "../components/molecules/ModalStep";
import CountdownTimer from "../components/organisms/CountdownTimer/page";
import {
  Box_1,
  BoxPosition,
  Centralized,
  Container,
  Title,
} from "../components/molecules/StylesPallete";
import { useEvent } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { EventName } from "./StylePage";
import {
  Action,
  LockedInput,
  LockedInputContainer,
  LockIcon,
  Logout,
} from "../components/atoms/Button/Styles";

function Home() {
  const { eventDate, setEventDate, eventName, setEventName, eventStatus, setEventStatus } =
    useEvent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const isFetching = useRef(false);
  const [hasFetchedEvent, setHasFetchedEvent] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      router.push("/");
    } else if (!eventDate && !hasFetchedEvent && isMounted && !isFetching.current) {
      isFetching.current = true;
      fetchEventDate().finally(() => {
        isFetching.current = false;
        setHasFetchedEvent(true);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [user, eventDate, hasFetchedEvent, router]);

  // Função para buscar o evento no Firebase
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

  useEffect(() => {
    if (eventDate) {
      const eventTime = new Date(eventDate).getTime();
      const currentTime = new Date().getTime();
      setEventStatus(currentTime >= eventTime ? "expired" : "active");
    } else {
      setEventStatus("no-event");
    }
  }, [eventDate, setEventStatus]);

  // Cria ou atualiza o documento com merge para evitar sobregravação total
  const handleEditEvent = async (newName: string, newDate: string) => {
    if (!user) return;
    const eventRef = doc(db, "events", user.uid);
    try {
      await setDoc(eventRef, { name: newName, date: newDate }, { merge: true });
      setEventName(newName);
      setEventDate(newDate);
      setHasFetchedEvent(true);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!user) return;
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      const eventRef = doc(db, "events", user.uid);
      await deleteDoc(eventRef);
      setEventName(null);
      setEventDate(null);
      setEventStatus("no-event");
      setHasFetchedEvent(true);
    }
  };

  return (
    <Container>
      <BoxPosition>
        <Title>Welcome to When & Where</Title>
        <p>Logged as: {user?.displayName}</p>

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
          <LockedInput disabled>Manage your Trip!</LockedInput>
        </LockedInputContainer>
      </Box_1>
      <Logout onClick={logout}>Logout</Logout>
      {/* MODAL COM STEPS PARA CRIAR/EDITAR EVENTO */}
      <ModalStep
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEditEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        isEditMode={eventStatus === "active"}
        initialName={eventName || ""}
        initialDate={eventDate || ""}
      />
    </Container>
  );
}

export default Home;
