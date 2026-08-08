import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytesAsync } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

export type EncryptedNamespace = 'recovery' | 'knowledge' | 'continuity';

const databasePromises = new Map<EncryptedNamespace, Promise<SQLite.SQLiteDatabase>>();
const operationQueues = new Map<EncryptedNamespace, Promise<unknown>>();

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

async function getOrCreateKey(alias: string): Promise<string> {
  const existing = await SecureStore.getItemAsync(alias);
  if (existing) return existing;
  const key = bytesToHex(await getRandomBytesAsync(32));
  await SecureStore.setItemAsync(alias, key, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return key;
}

function enqueue<T>(namespace: EncryptedNamespace, operation: () => Promise<T>): Promise<T> {
  const previous = operationQueues.get(namespace) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(operation);
  operationQueues.set(namespace, next);
  return next.finally(() => {
    if (operationQueues.get(namespace) === next) operationQueues.delete(namespace);
  });
}

function databaseFor(namespace: EncryptedNamespace): Promise<SQLite.SQLiteDatabase> {
  const existing = databasePromises.get(namespace);
  if (existing) return existing;

  const opened = (async () => {
    const key = await getOrCreateKey(`flow-hijacked-${namespace}-db-key-v1`);
    const db = await SQLite.openDatabaseAsync(`${namespace}.sqlite`);
    await db.execAsync(`PRAGMA key = '${key}';`);
    const cipher = await db.getFirstAsync<{ cipher_version: string }>('PRAGMA cipher_version;');
    if (!cipher?.cipher_version) {
      await db.closeAsync();
      throw new Error('Encrypted storage is unavailable');
    }
    await db.execAsync(
      'PRAGMA cipher_memory_security = ON; PRAGMA foreign_keys = ON; CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);',
    );
    return db;
  })();
  databasePromises.set(namespace, opened);
  opened.catch(() => {
    if (databasePromises.get(namespace) === opened) databasePromises.delete(namespace);
  });
  return opened;
}

/**
 * Cryptographically erases one Android continuity domain by closing and
 * deleting its SQLCipher database and deleting its device-bound key. Calls are
 * serialized after pending persistence writes so deletion cannot race a save.
 */
export async function destroyEncryptedStorage(namespace: EncryptedNamespace): Promise<void> {
  if (Platform.OS === 'web') return;
  await enqueue(namespace, async () => {
    const opened = databasePromises.get(namespace);
    databasePromises.delete(namespace);
    try {
      if (opened) {
        const db = await opened;
        await db.closeAsync();
      }
    } catch {
      // A cached open can reject before returning a handle. Continue to erase
      // the file and key; successful deletion is the user-visible contract.
    }

    let cleanupError: unknown;
    try {
      await SQLite.deleteDatabaseAsync(`${namespace}.sqlite`);
    } catch (error) {
      cleanupError = error;
    }
    try {
      await SecureStore.deleteItemAsync(`flow-hijacked-${namespace}-db-key-v1`);
    } catch (error) {
      cleanupError ??= error;
    }
    if (cleanupError) throw cleanupError;
  });
}

export function createEncryptedStorage(namespace: EncryptedNamespace): StateStorage {
  const webPrefix = `flow-hijacked-${namespace}:`;

  if (Platform.OS === 'web') {
    return {
      getItem: (name) => AsyncStorage.getItem(`${webPrefix}${name}`),
      setItem: (name, value) => AsyncStorage.setItem(`${webPrefix}${name}`, value),
      removeItem: (name) => AsyncStorage.removeItem(`${webPrefix}${name}`),
    };
  }

  return {
    async getItem(name) {
      return enqueue(namespace, async () => {
        const db = await databaseFor(namespace);
        const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM kv WHERE key = ?', name);
        return row?.value ?? null;
      });
    },
    async setItem(name, value) {
      await enqueue(namespace, async () => {
        const db = await databaseFor(namespace);
        await db.runAsync('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', name, value);
      });
    },
    async removeItem(name) {
      await enqueue(namespace, async () => {
        const db = await databaseFor(namespace);
        await db.runAsync('DELETE FROM kv WHERE key = ?', name);
      });
    },
  };
}
