/**
 * Flowtype definitions for dexie v3.0.1
 */

declare module 'dexie' {
  declare type BulkChangeResult<B: boolean, TKey> = $Call<
    ((value: true) => TKey[]) | ((value: false) => TKey),
    B,
  >;

  declare type StoreTables<DbStores> = $Exact<
    $ObjMap<DbStores, <T>(T) => Table<T>>,
  >;

  declare type StoreTable<
    DbStores,
    Name: $Keys<DbStores>,
    TKey = IndexableType,
  > = Table<$ElementType<DbStores, Name>, TKey>;

  declare type TransactionTableArg<DbStores> =
    | $Keys<DbStores>
    | $Values<StoreTables<DbStores>>;

  declare export type IndexSpec = {
    name: string,
    keyPath: string | Array<string> | void,
    unique: boolean | void,
    multi: boolean | void,
    auto: boolean | void,
    compound: boolean | void,
    src: string,
  };

  declare export type TableSchema = {
    name: string,
    primKey: IndexSpec,
    indexes: IndexSpec[],
    mappedClass: Function,
    idxByName: { [name: string]: IndexSpec },
    readHook?: (x: any) => any,
  };

  declare type IndexableTypePart =
    | string
    | number
    | Date
    | ArrayBuffer
    | ArrayBufferView
    | DataView
    | Array<Array<void>>;

  declare type IndexableTypeArray = Array<IndexableTypePart>;

  declare type IndexableTypeArrayReadonly = $ReadOnlyArray<IndexableTypePart>;

  declare export type IndexableType =
    | IndexableTypePart
    | IndexableTypeArrayReadonly;

  declare export type DexieEvent = {
    subscribers: Function[],
    fire(...args: any[]): any,
    subscribe(fn: (...args: any[]) => any): void,
    unsubscribe(fn: (...args: any[]) => any): void,
  };

  declare export type DexieEventSet = {
    (eventName: string): DexieEvent,

    addEventType(
      eventName: string,
      chainFunction?: (f1: Function, f2: Function) => Function,
      defaultFunction?: Function,
    ): DexieEvent,

    addEventType(events: {
      [eventName: string]:
        | 'asap'
        | [(f1: Function, f2: Function) => Function, Function],
    }): DexieEvent,
  };

  declare export type TransactionMode =
    | 'readonly'
    | 'readwrite'
    | 'r'
    | 'r!'
    | 'r?'
    | 'rw'
    | 'rw!'
    | 'rw?';

  declare export type PromiseExtendedConstructor = {
    +prototype: PromiseExtended<>,
    new<T>(
      executor: (
        resolve: (value?: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void,
      ) => void,
    ): PromiseExtended<T>,
    all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
        T8 | PromiseLike<T8>,
        T9 | PromiseLike<T9>,
        T10 | PromiseLike<T10>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>,
    all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
        T8 | PromiseLike<T8>,
        T9 | PromiseLike<T9>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>,
    all<T1, T2, T3, T4, T5, T6, T7, T8>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
        T8 | PromiseLike<T8>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4, T5, T6, T7, T8]>,
    all<T1, T2, T3, T4, T5, T6, T7>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4, T5, T6, T7]>,
    all<T1, T2, T3, T4, T5, T6>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4, T5, T6]>,
    all<T1, T2, T3, T4, T5>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4, T5]>,
    all<T1, T2, T3, T4>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
      ],
    ): PromiseExtended<[T1, T2, T3, T4]>,
    all<T1, T2, T3>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
      ],
    ): PromiseExtended<[T1, T2, T3]>,
    all<T1, T2>(
      values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>],
    ): PromiseExtended<[T1, T2]>,
    all<T>(values: (T | PromiseLike<T>)[]): PromiseExtended<T[]>,
    race<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
        T8 | PromiseLike<T8>,
        T9 | PromiseLike<T9>,
        T10 | PromiseLike<T10>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>,
    race<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
        T8 | PromiseLike<T8>,
        T9 | PromiseLike<T9>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>,
    race<T1, T2, T3, T4, T5, T6, T7, T8>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
        T8 | PromiseLike<T8>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>,
    race<T1, T2, T3, T4, T5, T6, T7>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
        T7 | PromiseLike<T7>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4 | T5 | T6 | T7>,
    race<T1, T2, T3, T4, T5, T6>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
        T6 | PromiseLike<T6>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4 | T5 | T6>,
    race<T1, T2, T3, T4, T5>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
        T5 | PromiseLike<T5>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4 | T5>,
    race<T1, T2, T3, T4>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
        T4 | PromiseLike<T4>,
      ],
    ): PromiseExtended<T1 | T2 | T3 | T4>,
    race<T1, T2, T3>(
      values: [
        T1 | PromiseLike<T1>,
        T2 | PromiseLike<T2>,
        T3 | PromiseLike<T3>,
      ],
    ): PromiseExtended<T1 | T2 | T3>,
    race<T1, T2>(
      values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>],
    ): PromiseExtended<T1 | T2>,
    race<T>(values: (T | PromiseLike<T>)[]): PromiseExtended<T>,
    reject(reason: any): PromiseExtended<void>,
    reject<T>(reason: any): PromiseExtended<T>,
    resolve<T>(value: T | PromiseLike<T>): PromiseExtended<T>,
    ...
  };

  /**
   * The interface of Dexie.Promise, which basically extends standard Promise with methods:
   *
   * finally() - also subject for standardization
   * timeout() - set a completion timeout
   * catch(ErrorClass, handler) - java style error catching
   * catch(errorName, handler) - cross-domain safe type error catching (checking error.name instead of instanceof)
   */
  declare export interface PromiseExtended<T> extends Promise<T> {
    then<TResult1>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | void
        | null,
      onrejected?:
        | ((reason: any) => TResult1 | PromiseLike<TResult1>)
        | void
        | null,
    ): PromiseExtended<TResult1>;
    catch<TResult>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | void
        | null,
    ): PromiseExtended<T | TResult>;
    catch<TResult>(
      ErrorConstructor: Function,
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | void
        | null,
    ): PromiseExtended<T | TResult>;
    catch<TResult>(
      errorName: string,
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | void
        | null,
    ): PromiseExtended<T | TResult>;
    finally<U>(onFinally?: () => U | PromiseLike<U>): PromiseExtended<T>;
    timeout(ms: number, msg?: string): PromiseExtended<T>;
  }

  declare type ThenShortcut<T, TResult> = (
    value: T,
  ) => TResult | PromiseLike<TResult>;

  declare export interface Collection<T = any, TKey = IndexableType> {
    and(filter: (x: T) => boolean): Collection<T, TKey>;

    clone(props?: Object): Collection<T, TKey>;

    count(): PromiseExtended<number>;

    count<R>(thenShortcut: ThenShortcut<number, R>): PromiseExtended<R>;

    distinct(): Collection<T, TKey>;

    each(
      callback: (
        obj: T,
        cursor: {
          key: IndexableType,
          primaryKey: TKey,
        },
      ) => any,
    ): PromiseExtended<void>;

    eachKey(
      callback: (
        key: IndexableType,
        cursor: {
          key: IndexableType,
          primaryKey: TKey,
        },
      ) => any,
    ): PromiseExtended<void>;

    eachPrimaryKey(
      callback: (
        key: TKey,
        cursor: {
          key: IndexableType,
          primaryKey: TKey,
        },
      ) => any,
    ): PromiseExtended<void>;

    eachUniqueKey(
      callback: (
        key: IndexableType,
        cursor: {
          key: IndexableType,
          primaryKey: TKey,
        },
      ) => any,
    ): PromiseExtended<void>;

    filter(filter: (x: T) => boolean): Collection<T, TKey>;

    first(): PromiseExtended<T | void>;

    first<R>(thenShortcut: ThenShortcut<T | void, R>): PromiseExtended<R>;

    keys(): PromiseExtended<IndexableTypeArray>;

    keys<R>(
      thenShortcut: ThenShortcut<IndexableTypeArray, R>,
    ): PromiseExtended<R>;

    primaryKeys(): PromiseExtended<TKey[]>;

    primaryKeys<R>(thenShortcut: ThenShortcut<TKey[], R>): PromiseExtended<R>;

    last(): PromiseExtended<T | void>;

    last<R>(thenShortcut: ThenShortcut<T | void, R>): PromiseExtended<R>;

    limit(n: number): Collection<T, TKey>;

    offset(n: number): Collection<T, TKey>;

    or(indexOrPrimayKey: string): WhereClause<T, TKey>;

    raw(): Collection<T, TKey>;

    reverse(): Collection<T, TKey>;

    sortBy(keyPath: string): PromiseExtended<T[]>;

    sortBy<R>(
      keyPath: string,
      thenShortcut: ThenShortcut<T[], R>,
    ): PromiseExtended<R>;

    toArray(): PromiseExtended<Array<T>>;

    toArray<R>(thenShortcut: ThenShortcut<T[], R>): PromiseExtended<R>;

    uniqueKeys(): PromiseExtended<IndexableTypeArray>;

    uniqueKeys<R>(
      thenShortcut: ThenShortcut<IndexableTypeArray, R>,
    ): PromiseExtended<R>;

    until(
      filter: (value: T) => boolean,
      includeStopEntry?: boolean,
    ): Collection<T, TKey>;

    delete(): PromiseExtended<number>;

    modify(
      changeCallback: (obj: T, ref: { value?: T }) => void | boolean,
    ): PromiseExtended<number>;
    modify(changes: $Shape<T>): PromiseExtended<number>;

    sortBy(field: $Keys<Entity>): DexieCollection<Entity>;

    reverse(): DexieCollection<Entity>;

    offset(count: number): DexieCollection<Entity>;

    limit(count: number): DexieCollection<Entity>;
  }

  declare export interface WhereClause<T = any, TKey = IndexableType> {
    above(key: any): Collection<T, TKey>;

    aboveOrEqual(key: any): Collection<T, TKey>;

    anyOf(keys: $ReadOnlyArray<IndexableType>): Collection<T, TKey>;

    anyOf(...keys: Array<IndexableType>): Collection<T, TKey>;

    anyOfIgnoreCase(keys: string[]): Collection<T, TKey>;

    anyOfIgnoreCase(...keys: string[]): Collection<T, TKey>;

    below(key: any): Collection<T, TKey>;

    belowOrEqual(key: any): Collection<T, TKey>;

    between(
      lower: any,
      upper: any,
      includeLower?: boolean,
      includeUpper?: boolean,
    ): Collection<T, TKey>;

    equals(key: IndexableType): Collection<T, TKey>;

    equalsIgnoreCase(key: string): Collection<T, TKey>;

    inAnyRange(
      ranges: $ReadOnlyArray<[any, any]>,
      options?: {
        includeLowers?: boolean,
        includeUppers?: boolean,
      },
    ): Collection<T, TKey>;

    startsWith(key: string): Collection<T, TKey>;

    startsWithAnyOf(prefixes: string[]): Collection<T, TKey>;

    startsWithAnyOf(...prefixes: string[]): Collection<T, TKey>;

    startsWithIgnoreCase(key: string): Collection<T, TKey>;

    startsWithAnyOfIgnoreCase(prefixes: string[]): Collection<T, TKey>;

    startsWithAnyOfIgnoreCase(...prefixes: string[]): Collection<T, TKey>;

    noneOf(keys: $ReadOnlyArray<IndexableType>): Collection<T, TKey>;

    notEqual(key: IndexableType): Collection<T, TKey>;
  }

  declare export type Database<DbStores> = {
    +name: string,
    +tables: Table<>[],

    table<T, TKey>(tableName: string): Table<T, TKey>,
    // TODO
    table<Name: $Keys<DbStores>, TKey = IndexableType>(
      tableName: Name,
    ): StoreTable<DbStores, Name, TKey>,

    // TODO: Deprecated API
    ...StoreTables<DbStores>,

    transaction<R>(
      mode: TransactionMode,
      ...args:
        | [Table<> | Array<Table<>>, () => PromiseLike<R> | R]
        | [Table<>, Table<>, () => PromiseLike<R> | R]
        | [Table<>, Table<>, Table<>, () => PromiseLike<R> | R]
        | [Table<>, Table<>, Table<>, Table<>, () => PromiseLike<R> | R]
        | [
            Table<>,
            Table<>,
            Table<>,
            Table<>,
            Table<>,
            () => PromiseLike<R> | R,
          ]
    ): PromiseExtended<R>,

    ...
  };

  declare export type TransactionEvents = {
    (eventName: 'complete', subscriber: () => any): void,
    (eventName: 'abort', subscriber: () => any): void,
    (eventName: 'error', subscriber: (error: any) => any): void,
    complete: DexieEvent,
    abort: DexieEvent,
    error: DexieEvent,
  } & DexieEventSet;

  declare export type Transaction<DbStores> = {
    db: Database<DbStores>,
    active: boolean,
    mode: IDBTransactionMode,
    storeNames: Array<string>,
    parent?: Transaction<DbStores>,
    on: TransactionEvents,

    abort(): void,

    table(tableName: string): Table<any, any>,

    table<T>(tableName: string): Table<T, any>,

    table<T, Key>(tableName: string): Table<T, Key>,

    // TODO: Deprecated API
    ...StoreTables<DbStores>,
    ...
  };

  declare export type CreatingHookContext<T, Key> = {
    onsuccess?: (primKey: Key) => void,
    onerror?: (err: any) => void,
  };

  declare export type UpdatingHookContext<T, Key> = {
    onsuccess?: (updatedObj: T) => void,
    onerror?: (err: any) => void,
  };

  declare export type DeletingHookContext<T, Key> = {
    onsuccess?: () => void,
    onerror?: (err: any) => void,
  };

  declare export type TableHooks<T = any, TKey = IndexableType> = {
    (
      eventName: 'creating',
      /** @param  {CreatingHookContext<T, TKey>}  this */
      subscriber: (primKey: TKey, obj: T, transaction: Transaction<{}>) => any,
    ): void,
    (eventName: 'reading', subscriber: (obj: T) => T | any): void,
    (
      eventName: 'updating',
      /** @param  {UpdatingHookContext<T, TKey>}  this */
      subscriber: (
        modifications: Object,
        primKey: TKey,
        obj: T,
        transaction: Transaction<{}>,
      ) => any,
    ): void,
    (
      eventName: 'deleting',
      /** @param  {DeletingHookContext<T, TKey>}  this */
      subscriber: (primKey: TKey, obj: T, transaction: Transaction<{}>) => any,
    ): void,
    creating: DexieEvent,
    reading: DexieEvent,
    updating: DexieEvent,
    deleting: DexieEvent,
  } & DexieEventSet;

  declare export var DBCoreRangeType: {
    +Equal: 1, // 1
    +Range: 2, // 2
    +Any: 3, // 3
    +Never: 4, // 4
  };

  declare export type DBCoreKeyRange = {
    +type: $Values<typeof DBCoreRangeType>,
    +lower: any,
    +lowerOpen?: boolean,
    +upper: any,
    +upperOpen?: boolean,
  };

  declare export type DBCoreTransaction = IDBTransaction & {
    abort(): void,
  };

  declare export type DBCoreTransactionRequest = {
    tables: string[],
    mode: 'readonly' | 'readwrite',
  };

  declare export type DBCoreMutateRequest =
    | DBCoreAddRequest
    | DBCorePutRequest
    | DBCoreDeleteRequest
    | DBCoreDeleteRangeRequest;

  declare export type DBCoreMutateResponse = {
    numFailures: number,
    failures: { [operationNumber: number]: Error },
    lastResult: any,
    /** Present on AddRequest and PutRequest if request.wantResults is truthy. */
    results?: any[],
  };

  declare export type DBCoreAddRequest = {
    type: 'add',
    trans: DBCoreTransaction,
    keys?: any[],
    values: any[],
    wantResults?: boolean,
  };

  declare export type DBCorePutRequest = {
    type: 'put',
    trans: DBCoreTransaction,
    keys?: any[],
    values: any[],
    wantResults?: boolean,
  };

  declare export type DBCoreDeleteRequest = {
    type: 'delete',
    trans: DBCoreTransaction,
    keys: any[],
  };

  declare export type DBCoreDeleteRangeRequest = {
    type: 'deleteRange',
    trans: DBCoreTransaction,
    range: DBCoreKeyRange,
  };

  declare export type DBCoreGetManyRequest = {
    trans: DBCoreTransaction,
    keys: any[],
  };

  declare export type DBCoreGetRequest = {
    trans: DBCoreTransaction,
    key: any,
  };

  declare export type DBCoreQuery = {
    /**
     * keyPath: null | string | string[];
     * null represents primary key. string a property, string[] several properties.
     */
    index: DBCoreIndex,
    range: DBCoreKeyRange,
  };

  declare export type DBCoreQueryRequest = {
    trans: DBCoreTransaction,
    values?: boolean,
    limit?: number,
    query: DBCoreQuery,
  };

  declare export type DBCoreQueryResponse = {
    result: any[],
  };

  declare export type DBCoreOpenCursorRequest = {
    trans: DBCoreTransaction,
    values?: boolean,
    unique?: boolean,
    reverse?: boolean,
    query: DBCoreQuery,
  };

  declare export type DBCoreCountRequest = {
    trans: DBCoreTransaction,
    query: DBCoreQuery,
  };

  declare export type DBCoreCursor = {
    +trans: DBCoreTransaction,
    +key: any,
    +primaryKey: any,
    +value?: any,
    +done?: boolean,

    continue(key?: any): void,

    continuePrimaryKey(key: any, primaryKey: any): void,

    advance(count: number): void,

    start(onNext: () => void): PromiseExtended<any>,

    stop(value?: any | PromiseExtended<any>): void,

    next(): PromiseExtended<DBCoreCursor>,

    fail(error: Error): void,

    ...
  };

  declare export type DBCoreSchema = {
    name: string,
    tables: DBCoreTableSchema[],
  };

  declare export type DBCoreTableSchema = {
    +name: string,
    +primaryKey: DBCoreIndex,
    +indexes: DBCoreIndex[],
    +getIndexByKeyPath: (
      keyPath: null | string | string[],
    ) => DBCoreIndex | void,
  };

  declare export type DBCoreIndex = {
    /**
     * Name of the index, or null for primary key
     */
    +name: string | null,

    /**
     * True if this index represents the primary key
     */
    +isPrimaryKey?: boolean,

    /**
     * True if this index represents the primary key and is not inbound (http://dexie.org/docs/inbound)
     */
    +outbound?: boolean,

    /**
     * True if and only if keyPath is an array (http://dexie.org/docs/Compound-Index)
     */
    +compound?: boolean,

    /**
     * keyPath, null for primary key, string for single-property indexes, Array<string> for compound indexes
     */
    +keyPath: null | string | string[],

    /**
     * Auto-generated primary key (does not apply to secondary indexes)
     */
    +autoIncrement?: boolean,

    /**
     * Whether index is unique. Also true if index is primary key.
     */
    +unique?: boolean,

    /**
     * Whether index is multiEntry.
     */
    +multiEntry?: boolean,

    /**
     * Extract (using keyPath) a key from given value (object)
     */
    +extractKey: (value: any) => any,
  };

  declare export type DBCore = {
    +stack: 'dbcore',
    +MIN_KEY: any,
    +MAX_KEY: any,
    +schema: DBCoreSchema,

    /** Transaction and Object Store */
    transaction(req: DBCoreTransactionRequest): DBCoreTransaction,
    cmp(a: any, b: any): number,
    table(name: string): DBCoreTable,
  };

  declare export type DBCoreTable = {
    +name: string,
    +schema: DBCoreTableSchema,

    mutate(req: DBCoreMutateRequest): PromiseExtended<DBCoreMutateResponse>,
    get(req: DBCoreGetRequest): PromiseExtended<any>,
    getMany(req: DBCoreGetManyRequest): PromiseExtended<any[]>,
    query(req: DBCoreQueryRequest): PromiseExtended<DBCoreQueryResponse>,
    openCursor(
      req: DBCoreOpenCursorRequest,
    ): PromiseExtended<DBCoreCursor | null>,
    count(req: DBCoreCountRequest): PromiseExtended<number>,
  };

  declare export interface Table<T = any, TKey = IndexableType> {
    +name: string;
    +schema: TableSchema;
    +hook: TableHooks<T, TKey>;
    +core: DBCoreTable;

    get(key: TKey): PromiseExtended<T | void>;

    get<R>(
      key: TKey,
      thenShortcut: ThenShortcut<T | void, R>,
    ): PromiseExtended<R>;

    get(equalityCriterias: $Shape<Entity>): PromiseExtended<T | void>;

    get<R>(
      equalityCriterias: $Shape<Entity>,
      thenShortcut: ThenShortcut<T | void, R>,
    ): PromiseExtended<R>;

    where(index: $Keys<T> | ':id' | string | string[]): WhereClause<T, TKey>;

    where(
      equalityCriterias: $Shape<T> | { [string]: IndexableType, ... },
    ): Collection<T, TKey>;

    filter(fn: (obj: T) => boolean): Collection<T, TKey>;

    count(): PromiseExtended<number>;

    count<R>(thenShortcut: ThenShortcut<number, R>): PromiseExtended<R>;

    offset(n: number): Collection<T, TKey>;

    limit(n: number): Collection<T, TKey>;

    each(
      callback: (obj: T, cursor: { key: any, primaryKey: TKey }) => any,
    ): PromiseExtended<void>;

    toArray(): PromiseExtended<Array<T>>;

    toArray<R>(thenShortcut: ThenShortcut<T[], R>): PromiseExtended<R>;

    toCollection(): Collection<T, TKey>;

    orderBy(index: $Keys<T> | string | string[]): Collection<T, TKey>;

    reverse(): Collection<T, TKey>;

    mapToClass(constructor: Function): Function;

    add(item: T, key?: TKey): PromiseExtended<TKey>;

    update(key: TKey | T, changes: $Shape<T>): PromiseExtended<number>;

    put(item: T, key?: TKey): PromiseExtended<TKey>;

    delete(key: TKey): PromiseExtended<void>;

    clear(): PromiseExtended<void>;

    bulkGet(keys: TKey[]): PromiseExtended<T[]>;

    bulkAdd<B: boolean>(
      items: T[],
      keys: IndexableTypeArrayReadonly,
      options: { allKeys: B },
    ): PromiseExtended<BulkChangeResult<B, TKey>>;

    bulkAdd<B: boolean>(
      items: T[],
      options: { allKeys: B },
    ): PromiseExtended<BulkChangeResult<B, TKey>>;

    bulkAdd(
      items: T[],
      keys?: IndexableTypeArrayReadonly,
      options?: { allKeys: boolean },
    ): PromiseExtended<TKey>;

    bulkPut<B: boolean>(
      items: T[],
      keys: IndexableTypeArrayReadonly,
      options: { allKeys: B },
    ): PromiseExtended<BulkChangeResult<B, TKey>>;

    bulkPut<B: boolean>(
      items: T[],
      options: { allKeys: B },
    ): PromiseExtended<BulkChangeResult<B, TKey>>;

    bulkPut(
      items: T[],
      keys?: IndexableTypeArrayReadonly,
      options?: { allKeys: boolean },
    ): PromiseExtended<TKey>;

    bulkDelete(keys: IndexableTypeArrayReadonly): PromiseExtended<void>;
  }

  declare export interface Version<DbStores> {
    stores(
      schema:
        | $Shape<$ObjMap<DbStores, () => string>>
        | { [tableName: string]: null },
    ): Version<DbStores>;

    upgrade(
      fn: (trans: Transaction<DbStores>) => any | Promise<any>,
    ): Version<DbStores>;
  }

  declare export type DexieOnReadyEvent = {
    subscribe(fn: () => any, bSticky: boolean): void,

    unsubscribe(fn: () => any): void,

    fire(): any,
  };

  declare export type DexieVersionChangeEvent = {
    subscribe(fn: (event: IDBVersionChangeEvent) => any): void,

    unsubscribe(fn: (event: IDBVersionChangeEvent) => any): void,

    fire(event: IDBVersionChangeEvent): any,
  };

  declare export type DexiePopulateEvent = {
    subscribe(fn: (trans: Transaction<{}>) => any): void,

    unsubscribe(fn: (trans: Transaction<{}>) => any): void,

    fire(trans: Transaction<{}>): any,
  };

  declare export type DbEvents = {
    (eventName: 'ready', subscriber: () => any, bSticky?: boolean): void,
    (eventName: 'populate', subscriber: (trans: Transaction<{}>) => any): void,
    (
      eventName: 'blocked',
      subscriber: (event: IDBVersionChangeEvent) => any,
    ): void,
    (
      eventName: 'versionchange',
      subscriber: (event: IDBVersionChangeEvent) => any,
    ): void,
    ready: DexieOnReadyEvent,
    populate: DexiePopulateEvent,
    blocked: DexieEvent,
    versionchange: DexieVersionChangeEvent,
  } & DexieEventSet;

  declare export type DbSchema = { [tableName: string]: TableSchema };

  declare export type Middleware<TStack: { +stack: string, ... }> = {
    stack: $ElementType<TStack, 'stack'>,
    create: (down: TStack) => $Shape<TStack>,
    level?: number,
    name?: string,
  };

  declare export type DexieStacks = {
    dbcore: DBCore,
  };

  declare export type DexieDb<DbStores> = {
    ...Database<DbStores>,

    +name: string,
    +tables: Table<>[],
    +verno: number,

    +_allTables: { [name: string]: Table<any, IndexableType> },

    +core: DBCore,

    /** this: DexieDb */
    _createTransaction: (
      mode: IDBTransactionMode,
      storeNames: ArrayLike<string>,
      dbschema: DbSchema,
      parentTransaction?: Transaction<DbStores> | null,
    ) => Transaction<DbStores>,

    _dbSchema: DbSchema,

    version(versionNumber: number): Version<DbStores>,

    on: DbEvents,

    open(): PromiseExtended<DexieDb<DbStores>>,

    table<T = any, TKey = IndexableType>(tableName: string): Table<T, TKey>,
    // TODO: Test typings
    table<Name: $Keys<DbStores>, TKey = IndexableType>(
      tableName: Name,
    ): StoreTable<DbStores, Name, TKey>,

    // TODO: Deprecated API
    ...StoreTables<DbStores>,

    transaction<R>(
      mode: TransactionMode,
      ...args:
        | [
            (
              | TransactionTableArg<DbStores>
              | Array<TransactionTableArg<DbStores>>
            ),
            (trans?: Transaction<DbStores>) => PromiseLike<R> | R,
          ]
        | [
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            (trans?: Transaction<DbStores>) => PromiseLike<R> | R,
          ]
        | [
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            (trans?: Transaction<DbStores>) => PromiseLike<R> | R,
          ]
        | [
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            (trans?: Transaction<DbStores>) => PromiseLike<R> | R,
          ]
        | [
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            TransactionTableArg<DbStores>,
            (trans?: Transaction<DbStores>) => PromiseLike<R> | R,
          ]
    ): PromiseExtended<R>,

    close(): void,

    delete(): PromiseExtended<void>,

    isOpen(): boolean,

    hasBeenClosed(): boolean,

    hasFailed(): boolean,

    dynamicallyOpened(): boolean,

    backendDB(): IDBDatabase,

    use(middleware: Middleware<DBCore>): DexieDb<DbStores>,

    unuse(Middleware<{ stack: $Keys<DexieStacks> }>): DexieDb<DbStores>,
    unuse({ stack: $Keys<DexieStacks>, name: string }): DexieDb<DbStores>,

    // Make it possible to touch physical class constructors where they reside - as properties on db instance.
    // For example, checking if (x instanceof db.Table). Can't do (x instanceof Dexie.Table because it's just a virtual interface)
    Table: { prototype: Table<> },
    WhereClause: { prototype: WhereClause<> },
    Version: { prototype: Version<> },
    Transaction: { prototype: Transaction<> },
    Collection: { prototype: Collection<> },
    ...
  };

  /**
   * DexieError
   *
   * Common base class for all errors originating from Dexie.js except TypeError,
   * SyntaxError and RangeError.
   *
   * http://dexie.org/docs/DexieErrors/DexieError
   */
  declare export type DexieError = {
    name: string,
    message: string,
    stack: string,
    inner: any,
    toString(): string,
    ...
  };

  /**
   * List of the names of auto-generated error classes that extends DexieError
   * and shares the interface of DexieError.
   *
   * Each error should be documented at http://dexie.org/docs/DexieErrors/Dexie.<errname>
   *
   * The generic type DexieExceptionClasses is a map of full error name to
   * error constructor. The DexieExceptionClasses is mixed in into Dexie,
   * so that it is always possible to throw or catch certain errors via
   * Dexie.ErrorName. Example:
   *
   * try {
   *    throw new Dexie.InvalidTableError("Invalid table foo", innerError?);
   * } catch (err) {
   *    if (err instanceof Dexie.InvalidTableError) {
   *      // Could also have check for err.name === "InvalidTableError", or
   *      // err.name === Dexie.errnames.InvalidTableError.
   *      console.log("Seems to be an invalid table here...");
   *    } else {
   *      throw err;
   *    }
   * }
   */
  declare export type DexieErrors = {
    OpenFailed: 'OpenFailedError',
    VersionChange: 'VersionChangeError',
    Schema: 'SchemaError',
    Upgrade: 'UpgradeError',
    InvalidTable: 'InvalidTableError',
    MissingAPI: 'MissingAPIError',
    NoSuchDatabase: 'NoSuchDatabaseError',
    InvalidArgument: 'InvalidArgumentError',
    SubTransaction: 'SubTransactionError',
    Unsupported: 'UnsupportedError',
    Internal: 'InternalError',
    DatabaseClosed: 'DatabaseClosedError',
    PrematureCommit: 'PrematureCommitError',
    ForeignAwait: 'ForeignAwaitError',
    Unknown: 'UnknownError',
    Constraint: 'ConstraintError',
    Data: 'DataError',
    TransactionInactive: 'TransactionInactiveError',
    ReadOnly: 'ReadOnlyError',
    Version: 'VersionError',
    NotFound: 'NotFoundError',
    InvalidState: 'InvalidStateError',
    InvalidAccess: 'InvalidAccessError',
    Abort: 'AbortError',
    Timeout: 'TimeoutError',
    QuotaExceeded: 'QuotaExceededError',
    DataClone: 'DataCloneError',
  };

  /**
   * ModifyError
   *
   * http://dexie.org/docs/DexieErrors/Dexie.ModifyError
   */
  declare export type ModifyError = {
    failures: Array<any>,
    failedKeys: IndexableTypeArrayReadonly,
    successCount: number,
  } & DexieError;

  /**
   * BulkError
   *
   * http://dexie.org/docs/DexieErrors/Dexie.BulkError
   */
  declare export type BulkError = {
    failures: { [operationNumber: number]: Error },
  } & DexieError;

  declare export interface DexieErrorConstructor {
    new(msg?: string, inner?: Object): DexieError;

    new(inner: Object): DexieError;

    prototype: DexieError;
  }

  declare export interface ModifyErrorConstructor {
    new(
      msg?: string,
      failures?: any[],
      successCount?: number,
      failedKeys?: IndexableTypeArrayReadonly,
    ): ModifyError;

    prototype: ModifyError;
  }

  declare export interface BulkErrorConstructor {
    new(
      msg?: string,
      failures?: { [operationNumber: number]: Error },
    ): BulkError;

    prototype: BulkError;
  }

  declare type ExceptionSet = $ObjMapi<
    { [k: $ElementType<DexieErrors, $Keys<DexieErrors>>]: any },
    <P>(P) => DexieErrorConstructor,
  >;

  declare type DexieExceptionClasses = ExceptionSet & {
    DexieError: DexieErrorConstructor,
    ModifyError: ModifyErrorConstructor,
    BulkError: BulkErrorConstructor,
  };

  declare export type DexieDOMDependencies = {
    indexedDB: IDBFactory,
    IDBKeyRange: typeof IDBKeyRange,
    IDBTransaction: typeof IDBTransaction,
    Error: typeof Error | string,
    SyntaxError: typeof SyntaxError | string,
    TypeError: typeof TypeError | string,
    DOMError: typeof DOMError | string,
    localStorage: typeof localStorage | null,
  };

  declare export type DexieOptions = {
    addons?: Array<(db: DexieDb<>) => void>,
    autoOpen?: boolean,
    indexedDB: IDBFactory,
    IDBKeyRange: typeof IDBKeyRange,
    allowEmptyDB?: boolean,
  };

  declare export default class Dexie<DbStores> {
    constructor(
      databaseName: string,
      options?: DexieOptions,
    ): DexieDb<DbStores>;

    static addons: Array<(db: DexieDb<>) => void>;
    static +version: number;
    static +semVer: string;
    static +currentTransaction: Transaction<>;
    static +maxKey: Array<Array<void>> | string;
    static +minKey: number;
    static +errnames: $ObjMapi<DexieExceptionClasses, <P>(P) => P>;
    static dependencies: DexieDOMDependencies;
    static Promise: PromiseExtendedConstructor;

    static waitFor<T>(
      promise: PromiseLike<T> | T,
      timeoutMilliseconds?: number,
    ): PromiseExtended<T>;
    static getDatabaseNames(): PromiseExtended<string[]>;
    static getDatabaseNames<R>(
      thenShortcut: ThenShortcut<string[], R>,
    ): PromiseExtended<R>;
    static vip<U>(scopeFunction: () => U): U;
    static ignoreTransaction<U>(fn: () => U): U;
    static override<F>(origFunc: F, overridedFactory: (fn: any) => any): F;
    static getByKeyPath(obj: Object, keyPath: string): any;
    static setByKeyPath(obj: Object, keyPath: string, value: any): void;
    static delByKeyPath(obj: Object, keyPath: string): void;
    static shallowClone<T>(obj: T): T;
    static deepClone<T>(obj: T): T;
    static asap(fn: Function): void;
    static exists(dbName: string): PromiseExtended<boolean>;
    static delete(dbName: string): PromiseExtended<void>;
    static Events(ctx?: any): DexieEventSet;

    static +DexieError: DexieErrorConstructor;
    static +ModifyError: ModifyErrorConstructor;
    static +BulkError: BulkErrorConstructor;
    static +OpenFailedError: DexieErrorConstructor;
    static +VersionChangeError: DexieErrorConstructor;
    static +SchemaError: DexieErrorConstructor;
    static +UpgradeError: DexieErrorConstructor;
    static +InvalidTableError: DexieErrorConstructor;
    static +MissingAPIError: DexieErrorConstructor;
    static +NoSuchDatabaseError: DexieErrorConstructor;
    static +InvalidArgumentError: DexieErrorConstructor;
    static +SubTransactionError: DexieErrorConstructor;
    static +UnsupportedError: DexieErrorConstructor;
    static +InternalError: DexieErrorConstructor;
    static +DatabaseClosedError: DexieErrorConstructor;
    static +PrematureCommitError: DexieErrorConstructor;
    static +ForeignAwaitError: DexieErrorConstructor;
    static +UnknownError: DexieErrorConstructor;
    static +ConstraintError: DexieErrorConstructor;
    static +DataError: DexieErrorConstructor;
    static +TransactionInactiveError: DexieErrorConstructor;
    static +ReadOnlyError: DexieErrorConstructor;
    static +VersionError: DexieErrorConstructor;
    static +NotFoundError: DexieErrorConstructor;
    static +InvalidStateError: DexieErrorConstructor;
    static +InvalidAccessError: DexieErrorConstructor;
    static +AbortError: DexieErrorConstructor;
    static +TimeoutError: DexieErrorConstructor;
    static +QuotaExceededError: DexieErrorConstructor;
    static +DataCloneError: DexieErrorConstructor;
  }
}
