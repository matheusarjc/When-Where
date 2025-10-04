import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "./types";

export async function upsertUserProfile(profile: UserProfile): Promise<void> {
  const ref = doc(db, "users", profile.id);
  await setDoc(
    ref,
    {
      email: profile.email,
      displayName: profile.fullName,
      username: profile.username,
      username_lower: profile.username.toLowerCase(),
      avatar: profile.avatar || null,
      bio: profile.bio || null,
      isPublic: profile.isPublic,
      createdAt: profile.createdAt ?? new Date(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid: string): Promise<Partial<UserProfile> | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    id: uid,
    email: data.email,
    fullName: data.displayName,
    username: data.username,
    avatar: data.avatar || undefined,
    bio: data.bio || undefined,
    isPublic: !!data.isPublic,
  };
}


