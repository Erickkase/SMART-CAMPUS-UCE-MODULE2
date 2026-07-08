const secureStore: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => secureStore[key] ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    secureStore[key] = value;
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    delete secureStore[key];
  }),
}));

let platformState = { os: 'ios' };

jest.mock('react-native', () => ({
  Platform: {
    get OS() {
      return platformState.os;
    },
  },
}));

const localStorageMock = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
})();

Object.defineProperty(global, 'window', {
  value: { localStorage: localStorageMock },
  writable: true,
});

/* eslint-disable import/first */
import { getToken, removeToken, setToken } from './storage';

describe('storage', () => {
  beforeEach(() => {
    Object.keys(secureStore).forEach((key) => delete secureStore[key]);
    localStorageMock.clear();
    platformState.os = 'ios';
  });

  describe('on native platforms', () => {
    it('stores, retrieves and removes a token using SecureStore', async () => {
      await expect(getToken()).resolves.toBeNull();

      await setToken('mock-token');
      await expect(getToken()).resolves.toBe('mock-token');

      await removeToken();
      await expect(getToken()).resolves.toBeNull();
    });
  });

  describe('on web', () => {
    beforeEach(() => {
      platformState.os = 'web';
    });

    it('falls back to localStorage on web', async () => {
      await expect(getToken()).resolves.toBeNull();

      await setToken('web-token');
      await expect(getToken()).resolves.toBe('web-token');

      await removeToken();
      await expect(getToken()).resolves.toBeNull();
    });

    it('returns null when window is undefined', async () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      });

      await expect(getToken()).resolves.toBeNull();

      Object.defineProperty(global, 'window', {
        value: { localStorage: localStorageMock },
        writable: true,
      });
    });
  });
});
