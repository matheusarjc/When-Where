import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmr-HGktQ5oyPuNcvP8EA8mXLG1uIpfMw",
  authDomain: "when-where-app-9a811.firebaseapp.com",
  projectId: "when-where-app-9a811",
  storageBucket: "when-where-app-9a811.firebasestorage.app",
  messagingSenderId: "719343586221",
  appId: "1:719343586221:web:9562a97eb0715bf9566f24",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
