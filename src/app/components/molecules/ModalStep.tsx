import { useState } from "react";
import styled from "styled-components";
import Button from "../atoms/Button/Button";
import { Delete } from "../atoms/Button/Styles";
import { Box } from "./StylesPallete";
import { FaRegWindowClose } from "react-icons/fa";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.8s ease-in-out;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.modalEdit};
  position: relative;
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  transition: 0.8s ease-in-out;
`;

const ModalContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const ModalBox = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const ModalBoxButton = styled(ModalBox)`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
const CloseButton = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
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
        <ModalContent>
          <h2>{isEditMode ? "Edit Event" : "Create an Event"}</h2>
          <ModalBox>
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
          </ModalBox>
        </ModalContent>
        <ModalBoxButton>
          <Button onClick={handleSave}>Save</Button>
          {isEditMode && <Delete onClick={onDelete}>Delete Event</Delete>}
        </ModalBoxButton>
        <CloseButton>
          <FaRegWindowClose onClick={onClose} />
        </CloseButton>
      </ModalContainer>
    </Overlay>
  );
}
