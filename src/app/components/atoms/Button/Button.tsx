import { StyledButton } from "./Styles";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Button;
