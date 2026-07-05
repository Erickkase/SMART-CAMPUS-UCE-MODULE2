import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'welfare-auth-token';

function isWeb(): boolean {
  return Platform.OS === 'web';
}

export async function getToken(): Promise<string | null> {
  if (isWeb()) {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (isWeb()) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
    return;
  }

  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  if (isWeb()) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    return;
  }

  return SecureStore.deleteItemAsync(TOKEN_KEY);
}
