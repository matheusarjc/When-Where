"use client";

import { createGlobalStyle } from "styled-components";
import "./global.module.css";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body{
    background-color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.screen.xs};
    font-family: 'Poppins', serif;
    overflow: hidden;

    @media (min-width: 768px){
      padding: ${({ theme }) => theme.screen.md};
    }
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyle;
