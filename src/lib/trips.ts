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
  const colRef = collection(db, "trips");

  const mapAndSend = (snap: any) => {
    const res: TripDoc[] = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }));
    // Se o servidor não ordenou, ordena por createdAt no cliente (desc)
    res.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    cb(res);
  };

  // Tenta usar orderBy (requer índice). Se falhar, refaz sem orderBy.
  let unsub = onSnapshot(
    query(colRef, where("userId", "==", userId), orderBy("createdAt", "desc")),
    mapAndSend,
    (err) => {
      // Falha por índice ausente → fallback sem orderBy
      if ((err as any)?.code === "failed-precondition") {
        // eslint-disable-next-line no-console
        console.warn("Firestore index ausente para trips; usando fallback sem orderBy.");
        unsub();
        unsub = onSnapshot(query(colRef, where("userId", "==", userId)), mapAndSend);
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  );
  return () => unsub();
}
