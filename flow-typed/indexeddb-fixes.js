// Fixes for Flow's built-in types ("flow-bin": "0.127.0")

declare interface IDBTransaction extends EventTarget {
  abort(): void;
  db: IDBDatabase;
  error: Error;
  mode: 'readonly' | 'readwrite' | 'versionchange';
  name: string;
  objectStore(name: string): IDBObjectStore;
  onabort: (e: any) => mixed;
  oncomplete: (e: any) => mixed;
  onerror: (e: any) => mixed;

  // Missed field in Flow's built-in types
  objectStoreNames: string[];
}
