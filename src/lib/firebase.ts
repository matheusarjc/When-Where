import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Verificar se estamos no ambiente correto e se as variáveis estão definidas
const isClient = typeof window !== "undefined";
const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase apenas se não estivermos em modo de desenvolvimento ou se as variáveis estiverem definidas
let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;

// Apenas inicializa Firebase se TODAS as variáveis necessárias estiverem presentes
const hasValidEnv = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

if (!isDevMode && hasValidEnv && (isClient || process.env.NEXT_PUBLIC_FIREBASE_API_KEY)) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    // Em caso de erro, criar objetos mock para desenvolvimento
    app = null;
    auth = null;
    googleProvider = null;
    db = null;
  }
}

export { auth, googleProvider, db };
