export interface CacheEntry<T> {
    value: T;
    lastUsed: number;
    timesUsed: number;
    created: number;
}

export interface Cache {
    has(key: string): Promise<boolean>;

    get<T>(key: string): Promise<T | null>;

    getEntry<T>(key: string): Promise<CacheEntry<T> | null>;

    set<T>(key: string, value: T): Promise<void>;

    delete(key: string): Promise<void>;
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
        return new Promise<CacheEntry<T> | null>((resolve, reject) => {
            const request = store.get(key);

            request.onsuccess = (event) => {
                if (request.result) {
                    const entry = request.result as CacheEntry<T>;
                    entry.value = JSON.parse(entry.value as string);
                    resolve(entry);
                } else {
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                reject(`Error getting entry: ${request.error}`);
            };
        });
    }

    async set<T>(key: string, value: T): Promise<void> {
        const store = await this.getObjectStore('readwrite');
        const now = Date.now();
        const entry: CacheEntry<T> = {
            value,
            lastUsed: now,
            timesUsed: 0,
            created: now
        };

        return new Promise<void>((resolve, reject) => {
            const request = store.put({...entry, key, value: JSON.stringify(value)});

            request.onsuccess = (event) => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error setting entry: ${request.error}`);
            };
        });
    }

    async delete(key: string): Promise<void> {
        const store = await this.getObjectStore('readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.delete(key);

            request.onsuccess = (event) => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error deleting entry: ${request.error}`);
            };
        });
    }

    private async updateLastUsed<T>(key: string, entry: CacheEntry<T>): Promise<void> {
        entry.lastUsed = Date.now();
        entry.timesUsed += 1;
        return this.set(key, entry.value);
    }
}
