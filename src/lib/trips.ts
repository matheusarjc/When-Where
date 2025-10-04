import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore";
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
  const col = collection(db, "trips");
  const q = query(col, where("userId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const res: TripDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    cb(res);
  });
}


