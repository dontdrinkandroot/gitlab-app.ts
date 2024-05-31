export interface CacheEntry<T> {
    value: T;
    lastUsed: number;
    timesUsed: number;
    created: number;
}

export interface CacheResult<T> {
    key: string;
    created?: number;
    value?: T;
}

export interface Cache {
    has(key: string): Promise<boolean>;

    get<T>(key: string): Promise<T | null>;

    getEntry<T>(key: string): Promise<CacheEntry<T> | null>;

    getResult<T>(key: string): Promise<CacheResult<T>>;

    set<T>(key: string, value: T): Promise<any>;

    delete(key: string): Promise<any>;
}

const DB_NAME = 'CacheDB';
const DB_VERSION = 1;

export class IndexDbCache implements Cache {
    private db$ = this.initDB();

    constructor(private readonly storeName: string = 'entries') {
    }

    private async initDB(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                reject(`Error opening DB: ${request.error}`);
            };

            request.onsuccess = (event) => {
                resolve(request.result);
            };

            request.onupgradeneeded = (event) => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, {keyPath: 'key'});
                }
            };
        });
    }

    private async getObjectStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.db$;
        const transaction = db.transaction([this.storeName], mode);
        return transaction.objectStore(this.storeName);
    }

    async has(key: string): Promise<boolean> {
        const entry = await this.getEntry<any>(key);
        return entry !== null;
    }

    async get<T>(key: string): Promise<T | null> {
        const entry = await this.getEntry<T>(key);
        if (entry) {
            this.updateLastUsed(key, entry);
            return entry.value;
        }
        return null;
    }

    async getEntry<T>(key: string): Promise<CacheEntry<T> | null> {
        const store = await this.getObjectStore('readonly');

        return this.promisifyRequest(store.get(key)).then((entry) => {
            if (entry) {
                entry.value = JSON.parse(entry.value as string);
                return entry as CacheEntry<T>;
            }
            return null;
        });
    }

    async getResult<T>(key: string): Promise<CacheResult<T>> {
        const entry = await this.getEntry<T>(key);
        return {key, value: entry?.value, created: entry?.created};
    }

    async set<T>(key: string, value: T): Promise<IDBValidKey> {
        const store = await this.getObjectStore('readwrite');
        const now = Date.now();
        const entry: CacheEntry<T> = {
            value,
            lastUsed: now,
            timesUsed: 0,
            created: now
        };

        return this.promisifyRequest(store.put({...entry, key, value: JSON.stringify(value)}));
    }

    async delete(key: string): Promise<undefined> {
        const store = await this.getObjectStore('readwrite');
        return this.promisifyRequest(store.delete(key));
    }

    private async updateLastUsed<T>(key: string, entry: CacheEntry<T>): Promise<IDBValidKey> {
        entry.lastUsed = Date.now();
        entry.timesUsed += 1;
        return this.set(key, entry.value);
    }

    private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request.onsuccess = (event) => resolve(request.result);
            request.onerror = (event) => reject(request.error);
        });
    }
}
