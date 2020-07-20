// @flow strict

import Dexie, {
  type DBCore,
  type DBCoreCursor,
  type DBCoreGetManyRequest,
  type DBCoreGetRequest,
  type DBCoreMutateRequest,
  type DBCoreMutateResponse,
  type DBCoreOpenCursorRequest,
  type DBCoreQueryRequest,
  type DBCoreQueryResponse,
  type DBCoreTable,
  type DBCoreTableSchema,
  type DBCoreTransaction,
  type Middleware,
  type PromiseExtended,
} from 'dexie';
import pick from 'lodash-es/pick';
import { keepTransactionUntil } from './keepTransactionUntil';

export type CryptoCipher = {
  encrypt(data: BufferSource): Promise<ArrayBuffer>,
  decrypt(data: BufferSource): Promise<ArrayBuffer>,
};

export type DataSerializer = {
  serialize<T: { ... }>(value: T): Promise<Uint8Array>,
  deserialize<T: { ... }>(buffer: Uint8Array | ArrayBuffer): Promise<T>,
};

export function createJsonDataSerializer(): DataSerializer {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder(undefined, { fatal: true });

  return {
    async serialize<T: { ... }>(value: T): Promise<Uint8Array> {
      return textEncoder.encode(JSON.stringify(value));
    },

    async deserialize<T: { ... }>(buffer): Promise<T> {
      return JSON.parse(textDecoder.decode(buffer));
    },
  };
}

export type DexieCryptoOptions = {
  /**
   * Tables for exclusion, they will be skipped by the crypto middleware.
   */
  +excludedTables?: Array<string>,
  +serializer?: DataSerializer,
};

export function createDexieCrypto(
  cipher: CryptoCipher,
  options?: DexieCryptoOptions,
): Middleware<DBCore> {
  type EncryptedValue<T: { ... }> = T & { _crypto?: ArrayBuffer, ... };

  const excludedTables: Set<string> = new Set(options?.excludedTables ?? []);
  const serializer: DataSerializer =
    options?.serializer ?? createJsonDataSerializer();

  const cachedKeyPaths: Map<string, Array<string>> = new Map();

  function getKeyPaths(schema: DBCoreTableSchema): Array<string> {
    let paths = cachedKeyPaths.get(schema.name);
    if (!paths) {
      paths = getTableKeyPaths(schema);
      cachedKeyPaths.set(schema.name, paths);
    }
    return paths;
  }

  function encrypt<T: { ... }>(
    entry: T,
    schema: DBCoreTableSchema,
  ): Promise<EncryptedValue<T>> {
    const keyPaths = getKeyPaths(schema);
    const result = pick(entry, keyPaths);

    return serializer
      .serialize(entry)
      .then((binaryData) => cipher.encrypt(binaryData))
      .then((encryptedData: ArrayBuffer) => {
        result._crypto = encryptedData;
        return result;
      });
  }

  function decrypt<T: { ... }>(encryptedValue: EncryptedValue<T>): Promise<T> {
    if (!encryptedValue._crypto) {
      return Promise.resolve(encryptedValue);
    }

    return cipher
      .decrypt(encryptedValue._crypto)
      .then((binaryData) => serializer.deserialize(binaryData));
  }

  function encryptValues<T: { ... }>(
    values: Array<T>,
    schema: DBCoreTableSchema,
  ): Promise<Array<EncryptedValue<T>>> {
    return values.length === 0
      ? Promise.resolve([])
      : Promise.all(values.map((value) => encrypt(value, schema)));
  }

  function decryptValue<T: { ... }>(
    encryptedValue: EncryptedValue<T> | null | void,
  ): Promise<T | null | void> {
    return encryptedValue
      ? decrypt(encryptedValue)
      : Promise.resolve(encryptedValue);
  }

  function decryptValues<T: { ... }>(
    encryptedValues: Array<EncryptedValue<T> | null | void>,
  ): Promise<Array<T | null | void>> {
    return encryptedValues.length === 0
      ? Promise.resolve([])
      : // $FlowFixMe
        Promise.all(encryptedValues.map((value) => decryptValue(value)));
  }

  function decryptQueryResponse(
    response: DBCoreQueryResponse,
  ): Promise<DBCoreQueryResponse> {
    return decryptValues(response.result).then((values) => ({
      ...response,
      result: values,
    }));
  }

  function createCryptoCursor(
    transaction: DBCoreTransaction,
    cursor: DBCoreCursor,
  ): DBCoreCursor {
    let decryptedValue;

    const cryptoCursor = Object.create(cursor, {
      start: {
        value: (onNext) => {
          return cursor
            .start(() => {
              keepTransactionUntil(transaction, decryptValue(cursor.value))
                .then((value) => {
                  decryptedValue = value;
                  onNext();
                  return undefined;
                })
                .catch((e) => {
                  decryptedValue = undefined;
                  cursor.fail(e);
                });
            })
            .then(() => decryptValue);
        },
      },
      value: {
        get() {
          return decryptedValue;
        },
      },
      key: {
        get() {
          // Workaround for using cursor by Dexie internal implementation.
          return cursor.key;
        },
      },
      primaryKey: {
        get() {
          // Workaround for using cursor by Dexie internal implementation.
          return cursor.primaryKey;
        },
      },
    });

    return cryptoCursor;
  }

  const middleware: Middleware<DBCore> = {
    stack: 'dbcore',
    name: 'Dexie Crypto Middleware',
    create(lowerDbCore: DBCore) {
      return {
        ...lowerDbCore,

        table(tableName) {
          const lowerTable: DBCoreTable = lowerDbCore.table(tableName);

          if (excludedTables.has(tableName)) {
            return lowerTable;
          }

          return {
            ...lowerTable,

            mutate(
              req: DBCoreMutateRequest,
            ): PromiseExtended<DBCoreMutateResponse> {
              if (req.type === 'add' || req.type === 'put') {
                return Dexie.waitFor(
                  encryptValues(req.values, lowerTable.schema),
                ).then((encryptedValues) => {
                  // $FlowFixMe
                  return lowerTable.mutate({
                    ...req,
                    values: encryptedValues,
                  });
                });
              } else {
                return lowerTable.mutate(req);
              }
            },

            get(request: DBCoreGetRequest) {
              return lowerTable
                .get(request)
                .then((encryptedValue) =>
                  Dexie.waitFor(decryptValue(encryptedValue)),
                );
            },

            getMany(
              request: DBCoreGetManyRequest,
            ): PromiseExtended<Array<mixed>> {
              return lowerTable.getMany(request).then((encryptedValues) =>
                // $FlowFixMe
                Dexie.waitFor(decryptValues(encryptedValues)),
              );
            },

            query(
              req: DBCoreQueryRequest,
            ): PromiseExtended<DBCoreQueryResponse> {
              return lowerTable.query(req).then((response) =>
                // $FlowFixMe
                Dexie.waitFor(decryptQueryResponse(response)),
              );
            },

            openCursor(
              req: DBCoreOpenCursorRequest,
            ): PromiseExtended<DBCoreCursor | null> {
              return lowerTable
                .openCursor(req)
                .then((cursor) =>
                  cursor ? createCryptoCursor(req.trans, cursor) : cursor,
                );
            },
          };
        },
      };
    },
  };

  return middleware;
}

function getTableKeyPaths(schema: DBCoreTableSchema): Array<string> {
  const resultPaths: Array<string> = [];

  [schema.primaryKey, ...schema.indexes].forEach(({ keyPath }) => {
    if (Array.isArray(keyPath)) {
      keyPath.forEach((path) => resultPaths.push(path));
    } else if (keyPath) {
      resultPaths.push(keyPath);
    }
  });

  return resultPaths;
}
