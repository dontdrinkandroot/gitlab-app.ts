export interface CacheEntry<T> {
    value: T;
    lastUsed: number;
    timesUsed: number;
    created: number;
}

export interface Cache {
    has(key: string): boolean;

    get<T>(key: string): T | null;

    getEntry<T>(key: string): CacheEntry<T> | null;

    set<T>(key: string, value: T): void;

    delete(key: string): void;
}

export class InMemoryCache implements Cache {
    private readonly cache: Map<string, CacheEntry<any>> = new Map();

    /**
     * @override
     */
    public has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * @override
     */
    public get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (entry) {
            entry.lastUsed = Date.now();
            entry.timesUsed++;
            return entry.value;
        }
        return null;
    }

    /**
     * @override
     */
    public getEntry<T>(key: string): CacheEntry<T> | null {
        const entry = this.cache.get(key);
        if (null != entry) {
            entry.lastUsed = Date.now();
            entry.timesUsed++;
            return entry;
        }
        return null;
    }

    /**
     * @override
     */
    public set<T>(key: string, value: T): void {
        this.cache.set(key, {
            value,
            lastUsed: Date.now(),
            timesUsed: 0,
            created: Date.now()
        });
    }

    /**
     * @override
     */
    public delete(key: string): void {
        this.cache.delete(key);
    }
}

export class LocalStorageCache implements Cache {

    constructor(private prefix: string) {
    }

    /**
     * @override
     */
    public has(key: string): boolean {
        return localStorage.getItem(this.getPrefixedKey(key)) !== null;
    }

    /**
     * @override
     */
    public get<T>(key: string): T | null {
        const entry = this.getEntry<T>(key);
        if (null != entry) {
            return entry.value;
        }
        return null;
    }

    /**
     * @override
     */
    public getEntry<T>(key: string): CacheEntry<T> | null {
        const entry = this.retrieveCacheEntry<T>(key);
        if (null != entry) {
            entry.lastUsed = Date.now();
            entry.timesUsed++;
            this.storeCacheEntry<T>(key, entry);
            return entry;
        }
        return null;
    }

    /**
     * @override
     */
    public set<T>(key: string, value: T): void {
        localStorage.setItem(this.getPrefixedKey(key), JSON.stringify({
            value,
            lastUsed: Date.now(),
            timesUsed: 0,
            created: Date.now()
        }));
    }

    /**
     * @override
     */
    public delete(key: string): void {
        localStorage.removeItem(this.getPrefixedKey(key));
    }

    private getPrefixedKey(key: string) {
        return this.prefix + key;
    }

    private storeCacheEntry<T>(key: string, entry: CacheEntry<T>) {
        localStorage.setItem(this.getPrefixedKey(key), JSON.stringify(entry));
    }

    private retrieveCacheEntry<T>(key: string): CacheEntry<T> | null {
        const value = localStorage.getItem(this.getPrefixedKey(key));
        if (null != value) {
            return JSON.parse(value);
        }
        return null;
    }
}
