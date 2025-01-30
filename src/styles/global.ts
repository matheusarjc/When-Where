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
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Poppins', serif;
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyle;
