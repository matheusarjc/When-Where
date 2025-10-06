#!/usr/bin/env node

/**
 * Script rápido para otimizações básicas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Iniciando otimizações rápidas...");

// Limpar cache do Next.js
function clearCache() {
  console.log("🧹 Limpando cache...");
  const cacheDir = path.join(__dirname, "..", ".next");
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ Cache limpo");
  }
}

// Verificar configurações
function checkConfig() {
  console.log("⚙️ Verificando configurações...");

  const nextConfigPath = path.join(__dirname, "..", "next.config.ts");
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, "utf8");

    const checks = [
      { name: "Image optimization", check: config.includes("quality:") },
      { name: "Package imports", check: config.includes("optimizePackageImports") },
      { name: "Compression", check: config.includes("compress: true") },
    ];

    checks.forEach(({ name, check }) => {
      console.log(`${check ? "✅" : "❌"} ${name}`);
    });
  }
}

// Executar
try {
  clearCache();
  checkConfig();

  console.log("\n🎉 Otimizações básicas concluídas!");
  console.log("\n📋 Próximos passos:");
  console.log("1. npm run dev");
  console.log("2. Verificar se os warnings desapareceram");
  console.log("3. Testar performance no navegador");
} catch (error) {
  console.error("❌ Erro:", error.message);
  process.exit(1);
}
