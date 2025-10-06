import { UserProfile } from "./types";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

// Mock auth functions (replace with real Supabase later)

export function getCurrentUser(): UserProfile | null {
  const userJson = localStorage.getItem("currentUser");
  if (!userJson) return null;

  const user = JSON.parse(userJson);
  // Convert date strings back to Date objects
  user.createdAt = new Date(user.createdAt);
  return user;
}

export function setCurrentUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export async function logout() {
  setCurrentUser(null);
  if (auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Erro durante signOut do Firebase:", error);
    }
  }
}

// Mock user database
export function getUserByUsername(username: string): UserProfile | null {
  const users = getMockUsers();
  return users.find((u) => u.username === username) || null;
}

export function searchUsers(query: string): UserProfile[] {
  const users = getMockUsers();
  const lowerQuery = query.toLowerCase();

  return users
    .filter(
      (u) =>
        u.username.toLowerCase().includes(lowerQuery) ||
        u.fullName.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 10);
}

export function followUser(currentUserId: string, targetUserId: string, isPublic: boolean) {
  const users = getMockUsers();
  const currentUser = users.find((u) => u.id === currentUserId);
  const targetUser = users.find((u) => u.id === targetUserId);

  if (!currentUser || !targetUser) return;

  if (isPublic) {
    // For public profiles, add immediately
    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
    }
    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
    }
  } else {
    // For private profiles, add to pending requests
    if (!targetUser.pendingRequests.includes(currentUserId)) {
      targetUser.pendingRequests.push(currentUserId);
    }
  }

  saveMockUsers(users);

  // Update current user in storage
  if (currentUserId === currentUser.id) {
    setCurrentUser(currentUser);
  }
}

export function unfollowUser(currentUserId: string, targetUserId: string) {
  const users = getMockUsers();
  const currentUser = users.find((u) => u.id === currentUserId);
  const targetUser = users.find((u) => u.id === targetUserId);

  if (!currentUser || !targetUser) return;

  currentUser.following = currentUser.following.filter((id) => id !== targetUserId);
  targetUser.followers = targetUser.followers.filter((id) => id !== currentUserId);

  saveMockUsers(users);

  if (currentUserId === currentUser.id) {
    setCurrentUser(currentUser);
  }
}

// Mock users storage
function getMockUsers(): UserProfile[] {
  const usersJson = localStorage.getItem("mockUsers");
  if (!usersJson) {
    const defaultUsers = createDefaultUsers();
    saveMockUsers(defaultUsers);
    return defaultUsers;
  }

  return JSON.parse(usersJson).map((u: any) => ({
    ...u,
    createdAt: new Date(u.createdAt),
  }));
}

function saveMockUsers(users: UserProfile[]) {
  localStorage.setItem("mockUsers", JSON.stringify(users));
}

function createDefaultUsers(): UserProfile[] {
  return [
    {
      id: "user-1",
      email: "maria@example.com",
      fullName: "Maria Silva",
      username: "mariasilva",
      avatar: "https://i.pravatar.cc/150?img=1",
      bio: "✈️ Viajante | 📸 Fotógrafa | 🌎 Explorando o mundo",
      isPublic: true,
      createdAt: new Date("2024-01-15"),
      following: [],
      followers: [],
      pendingRequests: [],
    },
    {
      id: "user-2",
      email: "joao@example.com",
      fullName: "João Santos",
      username: "joaosantos",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "🏔️ Aventureiro | 🎒 Mochileiro",
      isPublic: true,
      createdAt: new Date("2024-02-20"),
      following: [],
      followers: [],
      pendingRequests: [],
    },
    {
      id: "user-3",
      email: "ana@example.com",
      fullName: "Ana Costa",
      username: "anacosta",
      avatar: "https://i.pravatar.cc/150?img=5",
      bio: "🌺 Amante da natureza",
      isPublic: false,
      createdAt: new Date("2024-03-10"),
      following: [],
      followers: [],
      pendingRequests: [],
    },
  ];
}
