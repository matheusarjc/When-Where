import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Verificar se estamos no ambiente correto e se as variáveis estão definidas
const isClient = typeof window !== "undefined";
const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
};

// Inicializar Firebase apenas se não estivermos em modo de desenvolvimento ou se as variáveis estiverem definidas
let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;

if (!isDevMode && (isClient || process.env.NEXT_PUBLIC_FIREBASE_API_KEY)) {
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
