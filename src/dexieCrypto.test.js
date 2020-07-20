// @flow strict

import Dexie from 'dexie';
import { createDexieCrypto } from './dexieCrypto';
import { createTestAesGcmCipher, randomDbName } from '../test/testUtils';

describe('DexieCrypto', () => {
  type Entry = { key: string, value: string, index: number };

  it('should write unencrypted data without the plugin', async () => {
    const dbName = randomDbName();

    const dexieDb = new Dexie<{ entries: Entry }>(dbName);
    dexieDb.version(1).stores({ entries: '&key,index' });

    await dexieDb.entries.put({ key: 'foo', value: 'bar', index: 1 });
    dexieDb.close();

    const { indexedDB } = Dexie.dependencies;
    const rawDb = await toPromise(indexedDB.open(dbName));
    const transaction = await rawDb.transaction(rawDb.objectStoreNames);
    const store = transaction.objectStore('entries');

    const entry = await toPromise(store.get('foo'));
    expect(entry).toEqual({ key: 'foo', value: 'bar', index: 1 });
  });

  it('should write encrypted data', async () => {
    const dbName = randomDbName();
    const cipher = await createTestAesGcmCipher();

    const entity1 = { key: 'foo', value: 'bar', index: 1 };
    const entity2 = { key: 'xyz', value: 'qwe', index: 2 };

    const dexieDb = new Dexie<{ entries: Entry }>(dbName);
    dexieDb.version(1).stores({ entries: '&key,index' });

    const crypto = createDexieCrypto(cipher);
    dexieDb.use(crypto);

    await dexieDb.entries.put(entity1);
    await dexieDb.entries.put(entity2);
    dexieDb.close();

    // Test raw data in IndexedDB
    const { indexedDB } = Dexie.dependencies;
    const rawDb: IDBDatabase = await toPromise(indexedDB.open(dbName));
    const transaction = await rawDb.transaction(rawDb.objectStoreNames);
    const store = transaction.objectStore('entries');

    const entry = await toPromise(store.get('foo'));
    expect(entry).toMatchObject({ key: 'foo', index: 1 });
    expect(new Uint8Array(entry._crypto)).toMatchSnapshot();
  });

  it('should read encrypted data', async () => {
    const dbName = randomDbName();
    const cipher = await createTestAesGcmCipher();

    const entity1 = { key: 'foo', value: 'bar', index: 1 };
    const entity2 = { key: 'xyz', value: 'qwe', index: 2 };

    const dexieDb = new Dexie<{ entries: Entry }>(dbName);
    dexieDb.version(1).stores({ entries: '&key,index' });

    const crypto = createDexieCrypto(cipher);
    dexieDb.use(crypto);

    await dexieDb.entries.put(entity1);
    await dexieDb.entries.put(entity2);

    // Test reading
    const resultByGet = await dexieDb.entries.get('foo');
    expect(resultByGet).toEqual(entity1);

    const resultsByBulkGet = await dexieDb.entries.bulkGet(['foo', 'xyz']);
    expect(resultsByBulkGet).toEqual([entity1, entity2]);

    const resultByQuery = await dexieDb.entries.toArray();
    expect(resultByQuery).toEqual([entity1, entity2]);

    const countAll = await dexieDb.entries.count();
    expect(countAll).toBe(2);

    const countByKey = await dexieDb.entries.where({ key: 'xyz' }).count();
    expect(countByKey).toBe(1);

    const countByCursor = await dexieDb.entries
      .filter((entry) => entry.index === 1)
      .count();
    expect(countByCursor).toBe(1);

    const resultByCursor = await dexieDb.entries
      .filter((entry) => entry.index === 1 || entry.index === 2)
      .toArray();
    expect(resultByCursor).toEqual([entity1, entity2]);
  });

  it('should works with db version upgrading', async () => {
    const dbName = randomDbName();
    const cipher = await createTestAesGcmCipher();

    const entity1 = { key: 'foo', value: 'bar', index: 1 };
    const entity2 = { key: 'xyz', value: 'qwe', index: 2 };

    const db1 = new Dexie<{ entries: Entry }>(dbName);
    db1.use(createDexieCrypto(cipher));
    db1.version(1).stores({ entries: '&key,index' });

    await db1.entries.put(entity1);
    await db1.entries.put(entity2);
    db1.close();

    const db2 = new Dexie<{ entries: Entry }>(dbName);
    db2.use(createDexieCrypto(cipher));
    db2.version(1).stores({ entries: '&key,index' });
    db2
      .version(2)
      .stores({ entries: '&key,value' })
      .upgrade((transaction) => {
        return transaction.entries
          .toCollection()
          .modify((entry: Entry, ref) => {
            ref.value = { ...entry, value: entry.value.toUpperCase() };
          });
      });

    const resultEntries = await db2.entries.toArray();
    expect(resultEntries).toEqual([
      { ...entity1, value: 'BAR' },
      { ...entity2, value: 'QWE' },
    ]);

    const entryByIndex = await db2.entries.where({ value: 'QWE' }).first();
    expect(entryByIndex).toEqual({ ...entity2, value: 'QWE' });
  });

  describe('stress tests', () => {
    it('should iterate a table by a cursor in case a cipher work time is rather big', async () => {
      const cipher = await createTestAesGcmCipher();

      const items: Array<Entry> = new Array(100)
        .fill(undefined)
        .map((_, index) => ({
          key: `${index}`,
          value: new Array(1024).fill('x').join(''),
          index,
        }))
        .sort(({ key: key1 }, { key: key2 }) => key1.localeCompare(key2, 'en'));

      let db = new Dexie(randomDbName());
      db.version(1).stores({ entries: '&key' });
      db.use(createDexieCrypto(cipher));

      const table = db.table('entries');
      await table.bulkPut(items);

      const results = [];
      await table.each((value) => {
        results.push(value);
      });

      expect(results).toEqual(items);
    });
  });
});

function toPromise<R>(request: IDBRequest): Promise<R> {
  return new Promise((resolve, reject) => {
    // $FlowFixMe
    request.onsuccess = () => resolve((request.result: R));
    request.onerror = reject;
  });
}
