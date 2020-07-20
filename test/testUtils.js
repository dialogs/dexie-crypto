// @flow strict

import type {CryptoCipher} from '../src';

// prettier-ignore
export const TEST_KEY_RAW_AES_GCM_256: ArrayBuffer = Uint8Array.from([
  140, 22, 81, 137, 137, 56, 98, 28, 52, 215, 100, 110, 146, 161, 33, 228, 175,
  127, 154, 17, 189, 218, 72, 67, 182, 57, 17, 81, 245, 199, 172, 231,
]).buffer;

// prettier-ignore
export const TEST_AES_GCM_IV: Uint8Array = Uint8Array.from([
  192,  82,  0,  212,  94,  132,  246,  182,  214,  40,  191,  127,
]);

export function generateTestAesGcmKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);
}

export async function getTestAesKey(): Promise<CryptoKey> {
  const key: CryptoKey = await crypto.subtle.importKey(
    'raw',
    TEST_KEY_RAW_AES_GCM_256,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
  return key;
}

export async function createTestAesGcmCipher(): Promise<CryptoCipher> {
  const key: CryptoKey = await getTestAesKey();
  const iv = TEST_AES_GCM_IV;
  const algorithm = { name: 'AES-GCM', iv };

  return {
    encrypt(data: BufferSource): Promise<ArrayBuffer> {
      return crypto.subtle.encrypt(algorithm, key, data);
    },

    decrypt(encryptedData: BufferSource): Promise<ArrayBuffer> {
      return crypto.subtle.decrypt(algorithm, key, encryptedData);
    },
  };
}

export function randomDbName(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), v => v.toString(36)).join('');
}
