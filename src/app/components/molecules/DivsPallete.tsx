import styled from "styled-components";

const BoxStyled = styled.div`
  display: flex;
`;

interface BoxFlexedProps {
  flexDirection: "row" | "column";
  children: React.ReactNode;
}

const BoxFlexed: React.FC<BoxFlexedProps> = ({ children }) => {
  return <BoxStyled>{children}</BoxStyled>;
};

export default BoxFlexed;
