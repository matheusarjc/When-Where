import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Firebase Firestore
vi.mock("../lib/firebase", () => ({
  db: {},
}));

// Mock Firestore functions
vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  where: vi.fn(),
  Timestamp: {
    fromMillis: vi.fn((ms) => ({ toMillis: () => ms })),
  },
}));

import { createTrip, listenUserTrips, type TripDoc } from "../lib/trips";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const mockAddDoc = vi.mocked(addDoc);
const mockCollection = vi.mocked(collection);
const mockOnSnapshot = vi.mocked(onSnapshot);
const mockQuery = vi.mocked(query);
const mockWhere = vi.mocked(where);
const mockOrderBy = vi.mocked(orderBy);
const mockServerTimestamp = vi.mocked(serverTimestamp);

describe("trips", () => {
  const mockDocRef = { id: "trip-123" } as any;
  const mockCollectionRef = {} as any;
  const mockQueryRef = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCollection.mockReturnValue(mockCollectionRef);
    mockQuery.mockReturnValue(mockQueryRef);
    mockAddDoc.mockResolvedValue(mockDocRef);
    mockServerTimestamp.mockReturnValue("server-timestamp" as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createTrip", () => {
    it("cria uma nova viagem no Firestore", async () => {
      const tripData: TripDoc = {
        userId: "user-123",
        title: "Viagem para Paris",
        location: "Paris, França",
        startDate: "2024-06-01",
        endDate: "2024-06-10",
        coverUrl: "https://example.com/cover.jpg",
        isPublic: true,
      };

      const result = await createTrip(tripData);

      expect(mockCollection).toHaveBeenCalledWith({}, "trips");
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        userId: "user-123",
        title: "Viagem para Paris",
        location: "Paris, França",
        startDate: "2024-06-01",
        endDate: "2024-06-10",
        coverUrl: "https://example.com/cover.jpg",
        isPublic: true,
        createdAt: "server-timestamp",
      });
      expect(result).toBe("trip-123");
    });

    it("retorna o ID do documento criado", async () => {
      const tripData: TripDoc = {
        userId: "user-123",
        title: "Viagem para Paris",
        location: "Paris, França",
        startDate: "2024-06-01",
        endDate: "2024-06-10",
        coverUrl: "https://example.com/cover.jpg",
        isPublic: true,
      };

      const result = await createTrip(tripData);
      expect(result).toBe("trip-123");
    });
  });

  describe("listenUserTrips", () => {
    it("configura listener para viagens do usuário", () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const unsubscribe = listenUserTrips("user-123", mockCallback);

      expect(mockCollection).toHaveBeenCalledWith({}, "trips");
      expect(mockOnSnapshot).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe("function");
    });

    it("retorna função de unsubscribe", () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const unsubscribe = listenUserTrips("user-123", mockCallback);

      expect(typeof unsubscribe).toBe("function");
    });
  });
});
