import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Firebase Firestore
vi.mock('../lib/firebase', () => ({
  db: {}
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  serverTimestamp: vi.fn()
}));

import { upsertUserProfile, getUserProfile } from '../lib/user';
import { UserProfile } from '../lib/types';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const mockDoc = vi.mocked(doc);
const mockSetDoc = vi.mocked(setDoc);
const mockGetDoc = vi.mocked(getDoc);
const mockServerTimestamp = vi.mocked(serverTimestamp);

describe('user', () => {
  const mockDocRef = {};
  const mockDocSnapshot = {
    exists: vi.fn(),
    data: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDoc.mockReturnValue(mockDocRef);
    mockSetDoc.mockResolvedValue(undefined);
    mockGetDoc.mockResolvedValue(mockDocSnapshot);
    mockServerTimestamp.mockReturnValue('server-timestamp');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('upsertUserProfile', () => {
    it('cria ou atualiza perfil do usuário no Firestore', async () => {
      const userProfile: UserProfile = {
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'João Silva',
        username: 'joaosilva',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Desenvolvedor apaixonado por viagens',
        isPublic: true,
        createdAt: new Date('2024-01-01'),
        following: [],
        followers: [],
        pendingRequests: []
      };

      await upsertUserProfile(userProfile);

      expect(mockDoc).toHaveBeenCalledWith({}, 'users', 'user-123');
      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          email: 'user@example.com',
          displayName: 'João Silva',
          username: 'joaosilva',
          username_lower: 'joaosilva',
          avatar: 'https://example.com/avatar.jpg',
          bio: 'Desenvolvedor apaixonado por viagens',
          isPublic: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: 'server-timestamp'
        },
        { merge: true }
      );
    });

    it('converte username para lowercase no campo username_lower', async () => {
      const userProfile: UserProfile = {
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'João Silva',
        username: 'JOAOSILVA',
        isPublic: true,
        createdAt: new Date('2024-01-01'),
        following: [],
        followers: [],
        pendingRequests: []
      };

      await upsertUserProfile(userProfile);

      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          username: 'JOAOSILVA',
          username_lower: 'joaosilva'
        }),
        { merge: true }
      );
    });

    it('trata campos opcionais como null quando não fornecidos', async () => {
      const userProfile: UserProfile = {
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'João Silva',
        username: 'joaosilva',
        isPublic: true,
        createdAt: new Date('2024-01-01'),
        following: [],
        followers: [],
        pendingRequests: []
      };

      await upsertUserProfile(userProfile);

      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          avatar: null,
          bio: null
        }),
        { merge: true }
      );
    });

    it('usa createdAt fornecido ou data atual como fallback', async () => {
      const userProfile: UserProfile = {
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'João Silva',
        username: 'joaosilva',
        isPublic: true,
        createdAt: new Date('2024-01-01'),
        following: [],
        followers: [],
        pendingRequests: []
      };

      await upsertUserProfile(userProfile);

      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          createdAt: new Date('2024-01-01')
        }),
        { merge: true }
      );
    });
  });

  describe('getUserProfile', () => {
    it('retorna perfil do usuário quando existe', async () => {
      const mockData = {
        email: 'user@example.com',
        displayName: 'João Silva',
        username: 'joaosilva',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Desenvolvedor apaixonado por viagens',
        isPublic: true
      };

      mockDocSnapshot.exists.mockReturnValue(true);
      mockDocSnapshot.data.mockReturnValue(mockData);

      const result = await getUserProfile('user-123');

      expect(mockDoc).toHaveBeenCalledWith({}, 'users', 'user-123');
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual({
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'João Silva',
        username: 'joaosilva',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Desenvolvedor apaixonado por viagens',
        isPublic: true
      });
    });

    it('retorna null quando documento não existe', async () => {
      mockDocSnapshot.exists.mockReturnValue(false);

      const result = await getUserProfile('user-123');

      expect(result).toBeNull();
    });

    it('trata campos opcionais como undefined quando null no Firestore', async () => {
      const mockData = {
        email: 'user@example.com',
        displayName: 'João Silva',
        username: 'joaosilva',
        avatar: null,
        bio: null,
        isPublic: false
      };

      mockDocSnapshot.exists.mockReturnValue(true);
      mockDocSnapshot.data.mockReturnValue(mockData);

      const result = await getUserProfile('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'João Silva',
        username: 'joaosilva',
        avatar: undefined,
        bio: undefined,
        isPublic: false
      });
    });

    it('converte isPublic para boolean', async () => {
      const mockData = {
        email: 'user@example.com',
        displayName: 'João Silva',
        username: 'joaosilva',
        isPublic: 1 // Truthy value
      };

      mockDocSnapshot.exists.mockReturnValue(true);
      mockDocSnapshot.data.mockReturnValue(mockData);

      const result = await getUserProfile('user-123');

      expect(result?.isPublic).toBe(true);
    });
  });
});
