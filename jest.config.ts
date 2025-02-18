import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./", // Caminho da aplicação Next.js
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",

  // Mapeamento dos aliases do Next.js
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Setup global para Jest
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Ignorar a transformação de módulos do node_modules que podem causar erros
  transformIgnorePatterns: ["/node_modules/(?!@testing-library|@firebase|firebase/.*)"],

  // Configuração para suportar TypeScript corretamente
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

// Exporta a configuração ajustada para o Next.js
export default createJestConfig(config);
