import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmr-HGktQ5oyPuNcvP8EA8mXLG1uIpfMw",
  authDomain: "when-where-app-9a811.firebaseapp.com",
  projectId: "when-where-app-9a811",
  storageBucket: "when-where-app-9a811.firebasestorage.app",
  messagingSenderId: "719343586221",
  appId: "1:719343586221:web:9562a97eb0715bf9566f24",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
