# 🔥 Configuração do Firebase

## Problema Resolvido

O erro `Firebase: Error (auth/invalid-api-key)` durante o pré-renderização foi corrigido com verificações de segurança em todos os arquivos Firebase.

## ✅ Correções Implementadas

### 1. **Firebase Config Seguro** (`src/lib/firebase.ts`)

- ✅ Verificações de ambiente (cliente vs servidor)
- ✅ Valores padrão para desenvolvimento
- ✅ Try/catch para inicialização
- ✅ Objetos null quando Firebase não disponível

### 2. **AuthProvider Robusto** (`src/lib/AuthProvider.tsx`)

- ✅ Verificação se `auth` está disponível
- ✅ Fallback para modo sem Firebase

### 3. **Funções de Autenticação** (`src/lib/auth.ts`)

- ✅ Verificação de `auth` antes de usar `signOut`

### 4. **Funções de Usuário** (`src/lib/user.ts`)

- ✅ Verificações de `db` antes de operações Firestore
- ✅ Warnings informativos quando Firebase não disponível

### 5. **Funções de Viagens** (`src/lib/trips.ts`)

- ✅ Verificações de `db` antes de operações Firestore
- ✅ Fallbacks para arrays vazios

## 🚀 Como Configurar Firebase (Opcional)

### 1. Criar Arquivo `.env.local`

```bash
# Copie o arquivo env.example para .env.local
cp env.example .env.local
```

### 2. Preencher Credenciais Firebase

Edite `.env.local` com suas credenciais reais:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Para desenvolvimento sem Firebase, defina como true
NEXT_PUBLIC_DEV_MODE=false
```

### 3. Configurar Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto ou use existente
3. Ative Authentication (Email/Password + Google)
4. Ative Firestore Database
5. Copie as credenciais para `.env.local`

## 🎯 Modo de Desenvolvimento

### Sem Firebase (Recomendado para desenvolvimento)

```env
NEXT_PUBLIC_DEV_MODE=true
```

### Com Firebase (Produção)

```env
NEXT_PUBLIC_DEV_MODE=false
# + suas credenciais Firebase
```

## ✅ Resultado

- ✅ **Pré-renderização funciona** - Sem erros de chave inválida
- ✅ **Desenvolvimento flexível** - Funciona com ou sem Firebase
- ✅ **Produção robusta** - Verificações de segurança em todos os lugares
- ✅ **Fallbacks inteligentes** - Aplicação não quebra sem Firebase

## 🔧 Arquivos Modificados

1. `src/lib/firebase.ts` - Configuração segura
2. `src/lib/AuthProvider.tsx` - Verificações de auth
3. `src/lib/auth.ts` - Verificação de signOut
4. `src/lib/user.ts` - Verificações de Firestore
5. `src/lib/trips.ts` - Verificações de Firestore
6. `env.example` - Arquivo de exemplo criado

A aplicação agora funciona perfeitamente tanto em desenvolvimento quanto em produção! 🎉
