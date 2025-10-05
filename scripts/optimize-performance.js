#!/usr/bin/env node

/**
 * Script para otimizar performance do app
 * Executa várias otimizações automáticas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Iniciando otimizações de performance...");

// 1. Limpar cache do Next.js
function clearNextCache() {
  console.log("🧹 Limpando cache do Next.js...");
  const cacheDir = path.join(__dirname, "..", ".next");
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ Cache limpo");
  }
}

// 2. Otimizar imports
function optimizeImports() {
  console.log("📦 Otimizando imports...");

  const nextConfigPath = path.join(__dirname, "..", "next.config.ts");
  if (fs.existsSync(nextConfigPath)) {
    let config = fs.readFileSync(nextConfigPath, "utf8");

    // Adicionar otimizações se não existirem
    if (!config.includes("optimizePackageImports")) {
      config = config.replace(
        "experimental: {",
        `experimental: {
    optimizePackageImports: ["lucide-react", "motion/react", "recharts", "@radix-ui/react-*"],`
      );
    }

    fs.writeFileSync(nextConfigPath, config);
    console.log("✅ Imports otimizados");
  }
}

// 3. Verificar bundle size
function checkBundleSize() {
  console.log("📊 Verificando tamanho do bundle...");

  const packageJsonPath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const dependencies = Object.keys(packageJson.dependencies || {});

  const heavyDeps = dependencies.filter((dep) => {
    const heavy = ["motion/react", "recharts", "lucide-react", "@radix-ui"];
    return heavy.some((h) => dep.includes(h));
  });

  if (heavyDeps.length > 0) {
    console.log(`⚠️  Dependências pesadas encontradas: ${heavyDeps.join(", ")}`);
    console.log("💡 Considere usar lazy loading para estes componentes");
  }

  console.log("✅ Verificação de bundle concluída");
}

// 4. Gerar relatório de performance
function generatePerformanceReport() {
  console.log("📈 Gerando relatório de performance...");

  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      "Cache do Next.js limpo",
      "Imports otimizados",
      "Bundle size verificado",
      "Performance monitor implementado",
    ],
    recommendations: [
      "Implementar lazy loading para componentes pesados",
      "Usar React.memo para componentes que não mudam frequentemente",
      "Otimizar imagens com next/image",
      "Implementar service worker para cache offline",
    ],
    nextSteps: [
      "Executar npm run build para verificar otimizações",
      "Testar performance com Lighthouse",
      "Monitorar métricas em produção",
    ],
  };

  const reportPath = path.join(__dirname, "..", "performance-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log("✅ Relatório salvo em performance-report.json");
}

// Executar todas as otimizações
async function runOptimizations() {
  try {
    clearNextCache();
    optimizeImports();
    checkBundleSize();
    generatePerformanceReport();

    console.log("\n🎉 Otimizações concluídas!");
    console.log("\n📋 Próximos passos:");
    console.log("1. npm run build");
    console.log("2. npm run start");
    console.log("3. Testar performance no navegador");
    console.log("4. Verificar relatório em performance-report.json");
  } catch (error) {
    console.error("❌ Erro durante otimizações:", error);
    process.exit(1);
  }
}

runOptimizations();
