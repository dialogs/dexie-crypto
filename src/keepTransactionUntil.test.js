// @flow strict

import Dexie, { type DBCoreCursor, type DBCoreOpenCursorRequest } from 'dexie';
import { keepTransactionUntil } from './keepTransactionUntil';
import { randomDbName } from '../test/testUtils';

describe('keepTransactionUntil()', () => {
  it('should iterate a table with a slow cursor middleware', async () => {
    const items = [1, 2, 3, 4, 5].map((i) => ({ key: `${i}` }));

    const db = new Dexie(randomDbName());
    db.version(1).stores({ entries: '&key' });
    db.use(createSlowMiddleware());

    await db.table('entries').bulkPut(items);

    const results = [];

    await db.transaction('r', ['entries'], (trx) => {
      return trx.table('entries').each((value) => {
        results.push(value);
      });
    });

    expect(results).toEqual(items);
  });

  it('should copy a database with a slow cursor middleware', async () => {
    const items = [1, 2, 3, 4, 5].map((i) => ({ key: `${i}`, value: `v${i}` }));

    const sourceDb = new Dexie(randomDbName());
    sourceDb.version(1).stores({ entries: '&key' });
    sourceDb.use(createSlowMiddleware());

    const sourceTable = sourceDb.table('entries');
    await sourceTable.bulkPut(items);

    const destDb = new Dexie(randomDbName());
    destDb.version(1).stores({ entries: '&key' });
    await destDb.open();

    const destTable = destDb.table('entries');

    await sourceTable.each((value) => destTable.put(value));
    let results = await destTable.orderBy('key').toArray();
    expect(results).toEqual(items);

    await destTable.clear();
    await processTable(sourceTable, (value) => destTable.put(value));
    results = await destTable.orderBy('key').toArray();
    expect(results).toEqual(items);
  });

  function createSlowMiddleware() {
    const delay = 10;
    const slowOperation = () =>
      new Promise((resolve) => setTimeout(resolve, delay));

    function createSlowCursor(transaction, cursor): DBCoreCursor {
      return Object.create(cursor, {
        start: {
          value: function(onNext) {
            return cursor.start(() => {
              keepTransactionUntil(transaction, slowOperation())
                .then(() => {
                  onNext();
                  return undefined;
                })
                .catch((e) => {
                  cursor.fail(e);
                });
            });
          },
        },
        value: {
          get: function() {
            return cursor.value;
          },
        },
      });
    }

    const middleware = {
      stack: 'dbcore',
      name: 'Slow Cursor',
      create(lowerDbCore) {
        return {
          ...lowerDbCore,

          table(tableName) {
            const lowerTable = lowerDbCore.table(tableName);

            return {
              ...lowerTable,
              openCursor(req: DBCoreOpenCursorRequest) {
                return lowerTable.openCursor(req).then((cursor) => {
                  return cursor ? createSlowCursor(req.trans, cursor) : cursor;
                });
              },
            };
          },
        };
      },
    };

    return middleware;
  }

  function processTable(table, visitor) {
    let tailPromise;

    return table
      .each((value) => {
        const visitorPromise = visitor(value);
        tailPromise = tailPromise
          ? tailPromise.then(() => visitorPromise)
          : visitorPromise;
      })
      .then(() => tailPromise);
  }
});
