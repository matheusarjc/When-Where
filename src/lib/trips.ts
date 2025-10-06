import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface TripDoc {
  id?: string;
  userId: string;
  title: string;
  location: string;
  startDate: string; // ISO
  endDate: string; // ISO
  coverUrl: string;
  isPublic: boolean;
  createdAt?: Timestamp;
}

export async function createTrip(trip: TripDoc): Promise<string> {
  if (!db) {
    throw new Error("Firestore não está disponível");
  }

  const col = collection(db, "trips");
  const docRef = await addDoc(col, {
    userId: trip.userId,
    title: trip.title,
    location: trip.location,
    startDate: trip.startDate,
    endDate: trip.endDate,
    coverUrl: trip.coverUrl,
    isPublic: trip.isPublic,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function listenUserTrips(userId: string, cb: (trips: TripDoc[]) => void) {
  // Verificar se estamos no ambiente correto
  if (typeof window === "undefined") {
    cb([]);
    return () => {};
  }

  // Verificar se o Firestore está disponível
  if (!db) {
    console.warn("Firestore não está disponível. Retornando array vazio.");
    cb([]);
    return () => {};
  }

  const colRef = collection(db, "trips");

  const mapAndSend = (snap: any) => {
    const res: TripDoc[] = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }));
    // Se o servidor não ordenou, ordena por createdAt no cliente (desc)
    res.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    cb(res);
  };

  // Função para lidar com erros de forma mais robusta
  const handleError = (err: any) => {
    if ((err as any)?.code === "failed-precondition") {
      console.warn("Firestore index ausente para trips; usando fallback sem orderBy.");
      return true; // Indica que deve tentar fallback
    } else if ((err as any)?.code === "permission-denied") {
      console.warn("Permissão negada no Firestore. Usando dados locais.");
      cb([]);
      return false; // Não tenta fallback
    } else {
      console.error("Erro no Firestore:", err);
      cb([]);
      return false; // Não tenta fallback
    }
  };

  // Tenta usar orderBy (requer índice). Se falhar, refaz sem orderBy.
  let unsub = onSnapshot(
    query(colRef, where("userId", "==", userId), orderBy("createdAt", "desc")),
    mapAndSend,
    (err) => {
      if (handleError(err)) {
        // Se deve tentar fallback, faz unsubscribe e tenta sem orderBy
        unsub();
        unsub = onSnapshot(
          query(colRef, where("userId", "==", userId)),
          mapAndSend,
          (fallbackErr) => {
            handleError(fallbackErr);
          }
        );
      }
    }
  );

  return () => {
    try {
      unsub();
    } catch (e) {
      // Ignora erros ao fazer unsubscribe
    }
  };
}
