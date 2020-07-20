// @flow strict

import Dexie, { type PromiseExtended } from 'dexie';

type TransactionContext = {
  // $FlowFixMe
  waitingFor?: Promise<any>,
  waitingQueue: Array<() => void>,
};

const transactionContexts = new WeakMap<IDBTransaction, TransactionContext>();

export function keepTransactionUntil<R>(
  transaction: IDBTransaction,
  promise: Promise<mixed>,
): PromiseExtended<R> {
  const cachedContext = transactionContexts.get(transaction);
  const context: TransactionContext = cachedContext ?? {
    waitingFor: undefined,
    waitingQueue: [],
  };
  if (context !== cachedContext) {
    transactionContexts.set(transaction, context);
  }

  if (context.waitingFor) {
    // Already called waitFor(). Wait for both to complete.
    context.waitingFor = context.waitingFor.then(() => promise);
  } else {
    // We're not in waiting state. Start waiting state.
    context.waitingFor = promise;
    context.waitingQueue = [];

    // Start interacting with indexedDB until promise completes:
    const storeName = transaction.objectStoreNames[0];
    var store = transaction.objectStore(storeName);

    (function spin() {
      while (context?.waitingQueue.length) {
        context.waitingQueue.shift()();
      }
      if (context?.waitingFor) {
        store.get(-Infinity).onsuccess = spin;
      }
    })();
  }

  const currentWaitPromise = context.waitingFor;

  // $FlowFixMe
  return new Dexie.Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    promise
      .then(
        (result) => context.waitingQueue.push(resolve.bind(undefined, result)),
        (error) => context.waitingQueue.push(reject.bind(undefined, error)),
      )
      .finally(() => {
        if (context.waitingFor === currentWaitPromise) {
          // No one added a wait after us. Safe to stop the spinning.
          context.waitingFor = undefined;
        }
      });
  });
}
