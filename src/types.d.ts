import { DBCore, Middleware } from 'dexie';

export type CryptoCipher = {
  encrypt(data: BufferSource): Promise<ArrayBuffer>;
  decrypt(data: BufferSource): Promise<ArrayBuffer>;
};

export type DataSerializer = {
  serialize<T extends object>(value: T): Promise<Uint8Array>;
  deserialize<T extends object>(buffer: Uint8Array | ArrayBuffer): Promise<T>;
};

export function createJsonDataSerializer(): DataSerializer;

export type DexieCryptoOptions = {
  /**
   * Tables for exclusion, they will be skipped by the crypto middleware.
   */
  readonly excludedTables?: Array<string>;
  readonly serializer?: DataSerializer;
};

export function createDexieCrypto(
  cipher: CryptoCipher,
  options?: DexieCryptoOptions,
): Middleware<DBCore>;
