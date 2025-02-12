import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Configuração extra para testes
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Permite imports absolutos como "@/components/Button"
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest", // 🚀 Faz o Jest entender TS e TSX sem Babel
  },
};

export default config;
