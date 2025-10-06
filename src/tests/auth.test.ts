import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
vi.mock("../lib/firebase", () => ({ auth: {} }));
import { getCurrentUser, setCurrentUser, isAuthenticated, logout } from "../lib/auth";

const user = {
  id: "u1",
  email: "u1@example.com",
  fullName: "User One",
  username: "userone",
  isPublic: true,
  createdAt: new Date("2024-01-01"),
  following: [],
  followers: [],
  pendingRequests: [],
};

describe("auth localStorage mocks", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("retorna null quando não há usuário", () => {
    expect(getCurrentUser()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("salva e recupera o usuário", () => {
    setCurrentUser(user as any);
    const u = getCurrentUser();
    expect(u?.email).toBe("u1@example.com");
    expect(isAuthenticated()).toBe(true);
  });

  it("logout limpa o usuário", async () => {
    setCurrentUser(user as any);
    await logout();
    expect(getCurrentUser()).toBeNull();
  });
});
