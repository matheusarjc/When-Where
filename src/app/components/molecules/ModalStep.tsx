import { useState } from "react";
import styled from "styled-components";
import Button from "../atoms/Button/page";
import { Delete } from "../atoms/Button/Button";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundBox};
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

interface ModalStepProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventName: string, eventDate: string) => void;
  onEdit?: (eventName: string, eventDate: string) => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  initialName?: string;
  initialDate?: string;
}

export default function ModalStep({
  isOpen,
  onClose,
  onSave,
  onEdit,
  onDelete,
  isEditMode = false,
  initialName = "",
  initialDate = "",
}: ModalStepProps) {
  const [eventName, setEventName] = useState(initialName);
  const [eventDate, setEventDate] = useState(initialDate);

  if (!isOpen) return null;

  const handleSave = () => {
    if (isEditMode && onEdit) {
      onEdit(eventName, eventDate);
    } else {
      onSave(eventName, eventDate);
    }
    onClose();
  };

  return (
    <Overlay>
      <ModalContainer>
        <h2>{isEditMode ? "Edit Event" : "Create an Event"}</h2>
        <Input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <Button onClick={handleSave}>Save</Button>
        {isEditMode && <Delete onClick={onDelete}>Delete Event</Delete>}
        <Button onClick={onClose}>Cancel</Button>
      </ModalContainer>
    </Overlay>
  );
}
