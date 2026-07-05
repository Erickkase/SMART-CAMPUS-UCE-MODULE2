import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'welfare-auth-token';

function isWeb(): boolean {
  return Platform.OS === 'web';
}

function getWebStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage ?? null;
}

export async function getToken(): Promise<string | null> {
  if (isWeb()) {
    const storage = getWebStorage();
    return storage?.getItem(TOKEN_KEY) ?? null;
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (isWeb()) {
    const storage = getWebStorage();
    storage?.setItem(TOKEN_KEY, token);
    return;
  }

  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  if (isWeb()) {
    const storage = getWebStorage();
    storage?.removeItem(TOKEN_KEY);
    return;
  }

  return SecureStore.deleteItemAsync(TOKEN_KEY);
}
